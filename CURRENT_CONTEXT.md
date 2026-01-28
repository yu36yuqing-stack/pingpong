# CURRENT_CONTEXT.md (Updated 2026-01-29 00:44)

## Project: Pingpong
- Repo: https://github.com/yu36yuqing-stack/pingpong (Java + Admin + Miniprogram)
- Status: 
  - Backend LIVE (https://pingpong.waitworld.com/auth/dev-login)
  - Admin Frontend built (dist/ ready locally).
  - GitHub backup COMPLETE.
  - SSH Tunnel for Mac mini ACTIVE (ssh mac@139.196.84.63 -p 2222).

## Next Action
- Deploy 'pingpong-admin/dist' to ECS port 22 (Nginx root).
- Final Nginx config to serve Admin on / and Proxy API on / (or /api).

## Constraints
- 50k token rule ACTIVE.
- Gemini 3 Flash (Strategy) + GPT 5.2 (Execution).
