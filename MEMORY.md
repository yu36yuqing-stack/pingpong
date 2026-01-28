# MEMORY.md

## User preferences
- 虚舟偏好：对话尽量做阶段性压缩/总结，减少低价值长输出，避免上下文占用过高影响吞吐。
- 强规则：如果明显存在“更好的默认做法”（如能直接上 HTTPS、做自动续期等），**直接做到最好并告知结果**；除非涉及明显风险/成本/不可逆操作，否则不要再反复征求确认。
- 强规则：上下文控制以 **50k tokens** 为阈值（用 ~200KB 或 ~1500 行作为代理）；接近/超过时必须先压缩再继续推进。

## Environment notes
- 本机曾存在失效代理 `127.0.0.1:7890`（ClashXPro 遗留）；当前使用 Clash Verge 虚拟网卡代理。遇到网络/gh 请求走旧代理时，可用 `sudo` 或 `env -u http_proxy -u https_proxy -u all_proxy` 绕过。
