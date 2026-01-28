package com.example.pingpong.domain;

import javax.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "checkin_logs")
public class CheckinLog {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "course_id", nullable = true)
  private Long courseId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(nullable = false)
  private Instant checkedInAt = Instant.now();

  @Column(nullable = false, length = 32)
  private String result;

  @Column(nullable = true, length = 255)
  private String message;

  public CheckinLog() {}

  public CheckinLog(Long courseId, Long userId, String result, String message) {
    this.courseId = courseId;
    this.userId = userId;
    this.result = result;
    this.message = message;
    this.checkedInAt = Instant.now();
  }

  public Long getId() { return id; }
  public Long getCourseId() { return courseId; }
  public Long getUserId() { return userId; }
  public Instant getCheckedInAt() { return checkedInAt; }
  public String getResult() { return result; }
  public String getMessage() { return message; }
}
