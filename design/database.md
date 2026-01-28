# 数据库设计

## 1. 用户表 (Users)

- `user_id`: INT, 主键, 自增
- `open_id`: VARCHAR(64), UNIQUE, NOT NULL - 微信OpenID
- `name`: VARCHAR(50), NOT NULL - 用户姓名
- `role`: VARCHAR(20), NOT NULL - 角色 ('ADMIN', 'COACH', 'STUDENT')
- `balance`: INT, DEFAULT 0 - 学员剩余课时
- `created_at`: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

## 2. 课程表 (Courses)

- `course_id`: INT, 主键, 自增
- `start_time`: TIMESTAMP, NOT NULL - 课程开始时间
- `end_time`: TIMESTAMP, NOT NULL - 课程结束时间
- `coach_id`: INT, FOREIGN KEY (users.user_id) - 教练ID
- `status`: VARCHAR(20), DEFAULT 'SCHEDULED' - 课程状态 ('SCHEDULED', 'FINISHED', 'CANCELLED')
- `coach_confirmed`: BOOLEAN, DEFAULT FALSE - 教练是否已核销
- `created_at`: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

## 3. 课程学员关联表 (Course_Students)

- `id`: INT, 主键, 自增
- `course_id`: INT, FOREIGN KEY (courses.course_id) - 课程ID
- `student_id`: INT, FOREIGN KEY (users.user_id) - 学员ID
- `status`: VARCHAR(20), DEFAULT 'PENDING' - 学员状态 ('PENDING', 'CONSUMED', 'ABSENT')

## 4. 核销流水表 (Checkin_Logs)

- `log_id`: INT, 主键, 自增
- `course_id`: INT, FOREIGN KEY (courses.course_id) - 课程ID
- `user_id`: INT, FOREIGN KEY (users.user_id) - 扫码用户ID
- `checkin_time`: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP - 核销时间
- `user_role`: VARCHAR(20) - 用户当时的角色

## 5. 球台表 (Tables)

- `table_id`: INT, 主键, 自增
- `table_name`: VARCHAR(50), NOT NULL - 球台名称
- `status`: VARCHAR(20), DEFAULT 'AVAILABLE' - 球台状态 ('AVAILABLE', 'IN_USE', 'MAINTENANCE')

*Note: The PRD states "No Table Binding", but a simple table management module might still be useful for the admin.*
*Self-correction: The PRD v4.0 is very clear on "No Table Binding". The core philosophy is to remove spatial concepts. Therefore, I will not include the `Tables` table in the initial design. If the user wants to add it later, I can add it.*
