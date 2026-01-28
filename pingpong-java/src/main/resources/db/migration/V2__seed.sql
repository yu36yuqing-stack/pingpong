-- Seed admin + one user
INSERT INTO users(openid, name, role, created_at) VALUES
 ('dev_admin', '管理员', 'ADMIN', CURRENT_TIMESTAMP()),
 ('dev_alice', 'Alice', 'USER', CURRENT_TIMESTAMP());

-- Seed one course "ongoing" around now for demo (MySQL)
INSERT INTO courses(title, start_time, end_time, location, created_by, created_at) VALUES
 ('体验课', DATE_ADD(NOW(), INTERVAL -30 MINUTE), DATE_ADD(NOW(), INTERVAL 30 MINUTE), '1号台', 1, NOW());

-- Enroll Alice with 1 remaining session
INSERT INTO course_students(course_id, user_id, remaining_sessions, checked_in, last_checkin_at) VALUES
 (1, 2, 1, 0, NULL);
