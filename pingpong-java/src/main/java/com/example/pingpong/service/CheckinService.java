package com.example.pingpong.service;

import com.example.pingpong.domain.*;
import com.example.pingpong.repo.CheckinLogRepository;
import com.example.pingpong.repo.CourseStudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class CheckinService {

  private final CourseService courseService;
  private final CourseStudentRepository courseStudentRepository;
  private final CheckinLogRepository checkinLogRepository;

  public CheckinService(CourseService courseService,
                        CourseStudentRepository courseStudentRepository,
                        CheckinLogRepository checkinLogRepository) {
    this.courseService = courseService;
    this.courseStudentRepository = courseStudentRepository;
    this.checkinLogRepository = checkinLogRepository;
  }

  @Transactional
  public CheckinResult checkin(Long userId) {
    LocalDateTime now = LocalDateTime.now();
    List<Course> ongoing = courseService.findOngoing(now);

    if (ongoing.isEmpty()) {
      checkinLogRepository.save(new CheckinLog(null, userId, "NO_COURSE", "当前时间无可核销课程"));
      return new CheckinResult(false, null, "NO_COURSE", "当前时间无可核销课程");
    }

    // if multiple, pick earliest start
    ongoing.sort(Comparator.comparing(Course::getStartTime));

    for (Course c : ongoing) {
      var opt = courseStudentRepository.findByCourseIdAndUserId(c.getId(), userId);
      if (opt.isEmpty()) continue;
      CourseStudent cs = opt.get();

      if (Boolean.TRUE.equals(cs.getCheckedIn())) {
        checkinLogRepository.save(new CheckinLog(c.getId(), userId, "ALREADY", "已核销"));
        return new CheckinResult(false, c.getId(), "ALREADY", "已核销");
      }
      if (cs.getRemainingSessions() == null || cs.getRemainingSessions() <= 0) {
        checkinLogRepository.save(new CheckinLog(c.getId(), userId, "NO_REMAIN", "剩余课时不足"));
        return new CheckinResult(false, c.getId(), "NO_REMAIN", "剩余课时不足");
      }

      cs.setRemainingSessions(cs.getRemainingSessions() - 1);
      cs.setCheckedIn(true);
      cs.setLastCheckinAt(Instant.now());
      courseStudentRepository.save(cs);

      checkinLogRepository.save(new CheckinLog(c.getId(), userId, "OK", "核销成功"));
      return new CheckinResult(true, c.getId(), "OK", "核销成功");
    }

    checkinLogRepository.save(new CheckinLog(ongoing.get(0).getId(), userId, "NOT_ENROLLED", "未报名该课程"));
    return new CheckinResult(false, ongoing.get(0).getId(), "NOT_ENROLLED", "未报名该课程");
  }

  public static class CheckinResult {
    private boolean ok;
    private Long courseId;
    private String code;
    private String message;

    public CheckinResult() {}

    public CheckinResult(boolean ok, Long courseId, String code, String message) {
      this.ok = ok;
      this.courseId = courseId;
      this.code = code;
      this.message = message;
    }

    public boolean isOk() { return ok; }
    public void setOk(boolean ok) { this.ok = ok; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
  }
}
