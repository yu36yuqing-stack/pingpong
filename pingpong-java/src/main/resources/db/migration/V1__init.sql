CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) NOT NULL,
  name VARCHAR(64) NOT NULL,
  role VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT uk_users_openid UNIQUE (openid)
);

CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(128) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location VARCHAR(128),
  created_by BIGINT,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE course_students (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  remaining_sessions INT NOT NULL,
  checked_in BOOLEAN NOT NULL,
  last_checkin_at TIMESTAMP NULL,
  CONSTRAINT uk_course_students_course_user UNIQUE (course_id, user_id)
);

CREATE TABLE checkin_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NULL,
  user_id BIGINT NOT NULL,
  checked_in_at TIMESTAMP NOT NULL,
  result VARCHAR(32) NOT NULL,
  message VARCHAR(255)
);
