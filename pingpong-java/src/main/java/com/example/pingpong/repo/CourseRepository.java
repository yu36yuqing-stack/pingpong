package com.example.pingpong.repo;

import com.example.pingpong.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
  List<Course> findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(LocalDateTime now1, LocalDateTime now2);
}
