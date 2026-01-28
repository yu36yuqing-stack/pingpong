package com.example.pingpong.domain;

import javax.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "course_students", uniqueConstraints = {
    @UniqueConstraint(name = "uk_course_students_course_user", columnNames = {"course_id", "user_id"})
})
public class CourseStudent {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "course_id", nullable = false)
  private Long courseId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(nullable = false)
  private Integer remainingSessions = 1;

  @Column(nullable = false)
  private Boolean checkedIn = false;

  @Column(nullable = true)
  private Instant lastCheckinAt;

  public Long getId() { return id; }
  public Long getCourseId() { return courseId; }
  public void setCourseId(Long courseId) { this.courseId = courseId; }
  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }
  public Integer getRemainingSessions() { return remainingSessions; }
  public void setRemainingSessions(Integer remainingSessions) { this.remainingSessions = remainingSessions; }
  public Boolean getCheckedIn() { return checkedIn; }
  public void setCheckedIn(Boolean checkedIn) { this.checkedIn = checkedIn; }
  public Instant getLastCheckinAt() { return lastCheckinAt; }
  public void setLastCheckinAt(Instant lastCheckinAt) { this.lastCheckinAt = lastCheckinAt; }
}
