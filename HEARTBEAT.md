# HEARTBEAT.md

# Periodic maintenance (lightweight)
- STRONG RULE: If CURRENT_CONTEXT.md is near/over **50k tokens** (use ~200KB or ~1,500 lines as a practical proxy): **stop and compress it first** (keep only active decisions + next steps), move detail to memory/YYYY-MM-DD.md.
- Once per day: append a short 5-10 line status update to memory/YYYY-MM-DD.md.
- Every 3-4 days: distill durable items into MEMORY.md and remove noise.
- Sanity check: pingpong service + nginx are up (only if you’re already working on that project; otherwise skip).
