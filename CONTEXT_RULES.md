# CONTEXT_RULES.md

## Target budget (STRONG RULE)
- Keep operational context ≤ ~50k tokens.
- If we are at/over the threshold, **compress context before doing any further work**.

## Operating rules
1. Maintain **CURRENT_CONTEXT.md** as the single short rolling summary.
2. When CURRENT_CONTEXT.md grows beyond the threshold, compress it.
   - Practical threshold: **~200KB** file size (≈ ~50k tokens order-of-magnitude), or **~1,500 lines** (whichever comes first).
   - If uncertain, err on the side of compressing.
   - Move older details to memory/YYYY-MM-DD.md (raw) or MEMORY.md (curated)
   - Keep only decisions, endpoints, credentials *locations* (never secrets), and current blockers.
3. Prefer referencing files over repeating content in chat.
4. After each major milestone (deployment works, new feature shipped), add a 5-10 line entry to memory/YYYY-MM-DD.md.
5. Weekly: distill durable facts into MEMORY.md; delete/trim noisy items.

## What NOT to keep in rolling context
- Full logs
- Long error traces
- Repeated build output
- Secrets (keys/passwords)
