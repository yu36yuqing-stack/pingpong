# MEMORY.md

## User preferences
- 虚舟偏好：对话尽量做阶段性压缩/总结，减少低价值长输出，避免上下文占用过高影响吞吐。

## Environment notes
- 本机曾存在失效代理 `127.0.0.1:7890`（ClashXPro 遗留）；当前使用 Clash Verge 虚拟网卡代理。遇到网络/gh 请求走旧代理时，可用 `sudo` 或 `env -u http_proxy -u https_proxy -u all_proxy` 绕过。
