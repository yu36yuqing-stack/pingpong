# API 端点设计

## 1. 认证 (Authentication)

- `POST /auth/login`
  - **功能**: 微信小程序登录，换取 `open_id` 和 `session_key`，返回自定义登录态 (token)。
  - **请求**: `{ "code": "wx_login_code" }`
  - **响应**: `{ "token": "jwt_token", "userInfo": { ... } }`

## 2. 小程序端 API (Miniprogram API)

- `POST /scan/checkin`
  - **功能**: 用户扫码核销。这是核心功能。
  - **请求**: `{ "qrCodeContent": "GYM_CHECKOUT_QR" }` (Token in Header)
  - **响应**:
    - 成功: `{ "status": "success", "message": "核销成功", "course_info": { ... } }`
    - 失败: `{ "status": "error", "message": "当前时间段未找到您的课程..." }`

- `GET /user/courses`
  - **功能**: 获取当前用户（学员或教练）的课程列表。
  - **请求**: (Token in Header)
  - **响应**: `[{ "course_id": 1, "start_time": "...", "end_time": "...", ... }]`

- `GET /user/profile`
  - **功能**: 获取用户个人信息和学员的课时余额。
  - **请求**: (Token in Header)
  - **响应**: `{ "name": "...", "role": "STUDENT", "balance": 10 }`

## 3. 后台管理 API (Admin API)

- `POST /admin/courses`
  - **功能**: 创建新课程（排课）。
  - **请求**: `{ "start_time": "...", "end_time": "...", "coach_id": 1, "student_ids": [10, 11] }`
  - **响应**: `{ "status": "success", "course_id": 123 }`

- `PUT /admin/courses/:id`
  - **功能**: 修改课程信息。
  - **响应**: `{ "status": "success" }`

- `DELETE /admin/courses/:id`
  - **功能**: 取消课程。
  - **响应**: `{ "status": "success" }`

- `GET /admin/courses`
  - **功能**: 获取课程列表，支持按日期、教练、状态筛选。
  - **请求**: `?date=2023-10-27&coach_id=1`
  - **响应**: `[{ ... }]`

- `POST /admin/users/import`
  - **功能**: 从 Excel 文件批量导入用户（教练和学员）。
  - **请求**: `multipart/form-data` with excel file.
  - **响应**: `{ "status": "success", "imported": 50, "failed": 2 }`

- `GET /admin/reports/coach`
  - **功能**: 获取教练业绩报表。
  - **请求**: `?month=2023-10`
  - **响应**: `[{ "coach_id": 1, "name": "教练A", "completed_courses": 20 }]`

- `GET /admin/reports/student`
  - **功能**: 获取学员课时消耗报表。
  - **请求**: `?student_id=10&month=2023-10`
  - **响应**: `[{ "course_id": 1, "date": "...", "cost": 1 }]`
