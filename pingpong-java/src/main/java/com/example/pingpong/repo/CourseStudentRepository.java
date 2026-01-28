package com.example.pingpong.repo;

import com.example.pingpong.domain.CourseStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseStudentRepository extends JpaRepository<CourseStudent, Long> {
  Optional<CourseStudent> findByCourseIdAndUserId(Long courseId, Long userId);
  List<CourseStudent> findByUserId(Long userId);
}
