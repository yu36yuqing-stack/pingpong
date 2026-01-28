# pingpong-java (Spring Boot demo)

## Run

### Prereq
- Java 17+
- Maven 3.9+

```bash
cd pingpong-java
mvn spring-boot:run
# server: http://localhost:8080
# H2 console: http://localhost:8080/h2 (JDBC URL: jdbc:h2:mem:pp)
```

## API quick test (curl)

### 1) Admin login (dev)
```bash
ADMIN_TOKEN=$(curl -s http://localhost:8080/auth/dev-login \
  -H 'content-type: application/json' \
  -d '{"name":"admin","role":"ADMIN"}' | jq -r .token)
```

### 2) Student login (dev)
```bash
USER_TOKEN=$(curl -s http://localhost:8080/auth/dev-login \
  -H 'content-type: application/json' \
  -d '{"name":"alice"}' | jq -r .token)
```

### 3) Admin create a course (start/end covers now)
```bash
COURSE_ID=$(curl -s http://localhost:8080/admin/courses \
  -H "authorization: Bearer $ADMIN_TOKEN" \
  -H 'content-type: application/json' \
  -d '{
    "title":"晚间训练",
    "startTime":"2026-01-28T00:00:00",
    "endTime":"2026-12-31T23:59:59",
    "location":"1号台"
  }' | jq -r .id)
```

### 4) Admin enroll student to course (demo helper)
```bash
# NOTE: userId can be obtained via /user/profile
USER_ID=$(curl -s http://localhost:8080/user/profile \
  -H "authorization: Bearer $USER_TOKEN" | jq -r .id)

curl -s http://localhost:8080/admin/enroll \
  -H "authorization: Bearer $ADMIN_TOKEN" \
  -H 'content-type: application/json' \
  -d "{\"courseId\":$COURSE_ID,\"userId\":$USER_ID,\"remainingSessions\":1}" | jq
```

### 5) Student scan checkin
```bash
curl -s -X POST http://localhost:8080/scan/checkin \
  -H "authorization: Bearer $USER_TOKEN" | jq

# check status
curl -s http://localhost:8080/user/courses \
  -H "authorization: Bearer $USER_TOKEN" | jq
```

## Implemented endpoints
- POST /auth/login (wechat code -> openid stub: wx_{code})
- POST /auth/dev-login
- POST /scan/checkin
- GET /user/courses
- GET /user/profile
- admin CRUD: GET/POST/PUT/DELETE /admin/courses
- (demo helper) POST /admin/enroll
