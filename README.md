# 仓库说明

这个仓库历史上用于 `hello-java` 的示例（`HelloWorld.java`）。

当前开始承载 **「乒乓球馆教务核销系统」** 的代码与文档（Node.js 后端 + 管理后台 + 小程序前端骨架）。

---

# 乒乓球馆教务核销系统

这是一个乒乓球馆课程排课与扫码核销的全栈 Demo：

## 目录结构
- `backend/`：Node.js + Express 后端
- `frontend-admin/`：管理后台（静态页面 + JS 调接口）
- `frontend-miniprogram/`：微信小程序前端（骨架）
- `design/`：数据库与 API 设计文档
- `schema.sql`：数据库建表脚本

## 本地运行（后端）
1. `cd backend`
2. `npm install`
3. 配置 `.env`（微信登录与数据库参数）
4. 执行 `schema.sql` 建表
5. `npm run dev`

---

# hello-java（历史示例）

```bash
javac HelloWorld.java
java HelloWorld
```
