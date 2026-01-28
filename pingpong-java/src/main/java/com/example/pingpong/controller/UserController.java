package com.example.pingpong.controller;

import com.example.pingpong.auth.AuthUser;
import com.example.pingpong.domain.Course;
import com.example.pingpong.domain.CourseStudent;
import com.example.pingpong.dto.UserDtos;
import com.example.pingpong.repo.CourseRepository;
import com.example.pingpong.service.CourseService;
import com.example.pingpong.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {

  private final UserService userService;
  private final CourseService courseService;
  private final CourseRepository courseRepository;

  public UserController(UserService userService, CourseService courseService, CourseRepository courseRepository) {
    this.userService = userService;
    this.courseService = courseService;
    this.courseRepository = courseRepository;
  }

  @GetMapping("/profile")
  public UserDtos.ProfileResp profile(@AuthenticationPrincipal AuthUser principal) {
    var u = userService.requireById(principal.getUserId());
    return new UserDtos.ProfileResp(u.getId(), u.getOpenid(), u.getName(), u.getRole().name(), u.getCreatedAt());
  }

  @GetMapping("/courses")
  public List<Map<String, Object>> myCourses(@AuthenticationPrincipal AuthUser principal) {
    List<CourseStudent> enrolls = courseService.listEnrollments(principal.getUserId());
    List<Long> courseIds = enrolls.stream().map(CourseStudent::getCourseId).collect(java.util.stream.Collectors.toList());
    var courses = courseRepository.findAllById(courseIds).stream().collect(Collectors.toMap(Course::getId, c -> c));

    return enrolls.stream().map(cs -> {
      Course c = courses.get(cs.getCourseId());
      java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
      m.put("courseId", cs.getCourseId());
      m.put("title", c == null ? null : c.getTitle());
      m.put("startTime", c == null ? null : c.getStartTime());
      m.put("endTime", c == null ? null : c.getEndTime());
      m.put("location", c == null ? null : c.getLocation());
      m.put("remainingSessions", cs.getRemainingSessions());
      m.put("checkedIn", cs.getCheckedIn());
      m.put("lastCheckinAt", cs.getLastCheckinAt());
      return m;
    }).collect(java.util.stream.Collectors.toList());
  }
}
