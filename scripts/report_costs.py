#!/usr/bin/env python3
"""Daily cost report for Clawdbot sessions.

Purpose
- Summarize token usage and cost from session transcripts / logs.

How it works
- Scans text-like files under a directory (default: ./memory).
- Extracts token usage fields if present (prompt/input, completion/output, total).
- Extracts any explicit USD costs if present.

This script is intentionally heuristic because transcript formats vary.

Examples
  python3 scripts/report_costs.py
  python3 scripts/report_costs.py --path ./logs --days 7
  python3 scripts/report_costs.py --path ~/.clawdbot --since 2026-01-01
"""

from __future__ import annotations

import argparse
import dataclasses
import datetime as dt
import json
import os
import re
import sys
from pathlib import Path
from typing import Iterable, Optional


# --- heuristics / regex ---
TOKEN_FIELDS = {
    "prompt_tokens": "prompt",
    "input_tokens": "prompt",
    "completion_tokens": "completion",
    "output_tokens": "completion",
    "total_tokens": "total",
}

RE_KV_NUMBER = re.compile(r"\b([A-Za-z_][A-Za-z0-9_]*)\b\s*[:=]\s*([0-9]+)\b")
RE_COST_USD = re.compile(
    r"(?i)(?:cost|usd|\$)\s*[:=]?\s*\$?\s*([0-9]+(?:\.[0-9]+)?)"
)
RE_ISO_DATE = re.compile(r"\b(20\d{2}-\d{2}-\d{2})\b")

TEXT_EXTS = {".md", ".txt", ".log", ".json", ".jsonl"}
SKIP_DIRS = {".git", "node_modules", "dist", "build", "target"}


@dataclasses.dataclass
class Totals:
    prompt: int = 0
    completion: int = 0
    total: int = 0
    cost_usd: float = 0.0

    def add(self, other: "Totals") -> None:
        self.prompt += other.prompt
        self.completion += other.completion
        self.total += other.total
        self.cost_usd += other.cost_usd


def iter_files(root: Path) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        # prune
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            p = Path(dirpath) / fn
            if p.suffix.lower() in TEXT_EXTS:
                yield p


def date_for_file(p: Path) -> Optional[dt.date]:
    # Prefer YYYY-MM-DD in filename
    m = RE_ISO_DATE.search(p.name)
    if m:
        try:
            return dt.date.fromisoformat(m.group(1))
        except ValueError:
            pass
    # Fall back to mtime
    try:
        return dt.date.fromtimestamp(p.stat().st_mtime)
    except Exception:
        return None


def parse_json_usage(obj) -> Totals:
    t = Totals()

    def walk(x):
        nonlocal t
        if isinstance(x, dict):
            for k, v in x.items():
                lk = str(k)
                if lk in TOKEN_FIELDS and isinstance(v, int):
                    kind = TOKEN_FIELDS[lk]
                    if kind == "prompt":
                        t.prompt += v
                    elif kind == "completion":
                        t.completion += v
                    elif kind == "total":
                        t.total += v
                # common explicit cost keys
                if lk.lower() in {"cost", "cost_usd", "usd", "costusd"} and isinstance(v, (int, float)):
                    t.cost_usd += float(v)
                walk(v)
        elif isinstance(x, list):
            for it in x:
                walk(it)

    walk(obj)
    return t


def parse_text(blob: str) -> Totals:
    t = Totals()

    # key/value numbers like prompt_tokens: 123
    for key, num in RE_KV_NUMBER.findall(blob):
        if key in TOKEN_FIELDS:
            val = int(num)
            kind = TOKEN_FIELDS[key]
            if kind == "prompt":
                t.prompt += val
            elif kind == "completion":
                t.completion += val
            elif kind == "total":
                t.total += val

    # explicit costs in text (very heuristic)
    for num in RE_COST_USD.findall(blob):
        try:
            t.cost_usd += float(num)
        except ValueError:
            pass

    return t


def parse_file(p: Path) -> Totals:
    try:
        data = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return Totals()

    # Try JSON first if it looks like JSON
    stripped = data.lstrip()
    if p.suffix.lower() in {".json", ".jsonl"} and stripped:
        if p.suffix.lower() == ".jsonl":
            total = Totals()
            for line in data.splitlines():
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except Exception:
                    total.add(parse_text(line))
                    continue
                total.add(parse_json_usage(obj))
            return total
        else:
            try:
                obj = json.loads(data)
                return parse_json_usage(obj)
            except Exception:
                pass

    return parse_text(data)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=str(Path("./memory")), help="Directory to scan (default: ./memory)")
    ap.add_argument("--days", type=int, default=1, help="How many trailing days to include (default: 1)")
    ap.add_argument("--since", default=None, help="Start date YYYY-MM-DD (overrides --days)")
    args = ap.parse_args()

    root = Path(os.path.expanduser(args.path)).resolve()
    if not root.exists():
        print(f"Path not found: {root}", file=sys.stderr)
        return 2

    today = dt.date.today()
    if args.since:
        start = dt.date.fromisoformat(args.since)
    else:
        start = today - dt.timedelta(days=max(args.days, 1) - 1)

    by_day: dict[dt.date, Totals] = {}

    for p in iter_files(root):
        d = date_for_file(p)
        if not d or d < start or d > today:
            continue
        t = parse_file(p)
        if (t.prompt, t.completion, t.total, t.cost_usd) == (0, 0, 0, 0.0):
            continue
        by_day.setdefault(d, Totals()).add(t)

    if not by_day:
        print(f"No token/cost data found in {root} from {start}..{today}.")
        return 0

    grand = Totals()
    for d in sorted(by_day.keys()):
        t = by_day[d]
        # if total absent, derive it
        total_tokens = t.total if t.total else (t.prompt + t.completion)
        grand.prompt += t.prompt
        grand.completion += t.completion
        grand.total += total_tokens
        grand.cost_usd += t.cost_usd
        print(
            f"{d.isoformat()}  prompt={t.prompt}  completion={t.completion}  total={total_tokens}  cost_usd={t.cost_usd:.6f}"
        )

    print("-" * 72)
    grand_total = grand.total if grand.total else (grand.prompt + grand.completion)
    print(
        f"TOTAL       prompt={grand.prompt}  completion={grand.completion}  total={grand_total}  cost_usd={grand.cost_usd:.6f}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
