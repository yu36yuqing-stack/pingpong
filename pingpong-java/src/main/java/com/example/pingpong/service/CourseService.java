package com.example.pingpong.service;

import com.example.pingpong.domain.Course;
import com.example.pingpong.domain.CourseStudent;
import com.example.pingpong.repo.CourseRepository;
import com.example.pingpong.repo.CourseStudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseService {

  private final CourseRepository courseRepository;
  private final CourseStudentRepository courseStudentRepository;

  public CourseService(CourseRepository courseRepository, CourseStudentRepository courseStudentRepository) {
    this.courseRepository = courseRepository;
    this.courseStudentRepository = courseStudentRepository;
  }

  public List<Course> listAll() {
    return courseRepository.findAll();
  }

  public Course require(Long id) {
    return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("course not found"));
  }

  @Transactional
  public Course create(Course c) {
    return courseRepository.save(c);
  }

  @Transactional
  public Course update(Long id, Course patch) {
    Course c = require(id);
    c.setTitle(patch.getTitle());
    c.setStartTime(patch.getStartTime());
    c.setEndTime(patch.getEndTime());
    c.setLocation(patch.getLocation());
    return courseRepository.save(c);
  }

  @Transactional
  public void delete(Long id) {
    courseRepository.deleteById(id);
  }

  public List<CourseStudent> listEnrollments(Long userId) {
    return courseStudentRepository.findByUserId(userId);
  }

  public List<Course> findOngoing(LocalDateTime now) {
    return courseRepository.findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(now, now);
  }
}
