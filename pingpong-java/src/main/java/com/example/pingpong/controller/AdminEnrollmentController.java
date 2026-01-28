package com.example.pingpong.controller;

import com.example.pingpong.domain.CourseStudent;
import com.example.pingpong.repo.CourseStudentRepository;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/enroll")
public class AdminEnrollmentController {

  private final CourseStudentRepository courseStudentRepository;

  public AdminEnrollmentController(CourseStudentRepository courseStudentRepository) {
    this.courseStudentRepository = courseStudentRepository;
  }

  public static class EnrollReq {
    @NotNull
    private Long courseId;
    @NotNull
    private Long userId;
    @Min(0)
    private Integer remainingSessions;

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Integer getRemainingSessions() { return remainingSessions; }
    public void setRemainingSessions(Integer remainingSessions) { this.remainingSessions = remainingSessions; }
  }

  @PostMapping
  public Map<String, Object> enroll(@RequestBody EnrollReq req) {
    CourseStudent cs = courseStudentRepository.findByCourseIdAndUserId(req.getCourseId(), req.getUserId())
        .orElseGet(CourseStudent::new);
    cs.setCourseId(req.getCourseId());
    cs.setUserId(req.getUserId());
    cs.setRemainingSessions(req.getRemainingSessions() == null ? 1 : req.getRemainingSessions());
    cs.setCheckedIn(false);
    courseStudentRepository.save(cs);
    return Map.of("ok", true);
  }
}
