package com.example.pingpong.controller;

import com.example.pingpong.auth.AuthUser;
import com.example.pingpong.domain.Course;
import com.example.pingpong.dto.CourseDtos;
import com.example.pingpong.service.CourseService;
import javax.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/courses")
public class AdminCourseController {

  private final CourseService courseService;

  public AdminCourseController(CourseService courseService) {
    this.courseService = courseService;
  }

  @GetMapping
  public List<CourseDtos.CourseResp> list() {
    return courseService.listAll().stream().map(AdminCourseController::toResp).collect(java.util.stream.Collectors.toList());
  }

  @GetMapping("/{id}")
  public CourseDtos.CourseResp get(@PathVariable Long id) {
    return toResp(courseService.require(id));
  }

  @PostMapping
  public CourseDtos.CourseResp create(@AuthenticationPrincipal AuthUser principal,
                                     @RequestBody @Valid CourseDtos.CourseReq req) {
    Course c = new Course();
    c.setTitle(req.getTitle());
    c.setStartTime(req.getStartTime());
    c.setEndTime(req.getEndTime());
    c.setLocation(req.getLocation());
    c.setCreatedBy(principal.getUserId());
    return toResp(courseService.create(c));
  }

  @PutMapping("/{id}")
  public CourseDtos.CourseResp update(@PathVariable Long id, @RequestBody @Valid CourseDtos.CourseReq req) {
    Course patch = new Course();
    patch.setTitle(req.getTitle());
    patch.setStartTime(req.getStartTime());
    patch.setEndTime(req.getEndTime());
    patch.setLocation(req.getLocation());
    return toResp(courseService.update(id, patch));
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    courseService.delete(id);
  }

  private static CourseDtos.CourseResp toResp(Course c) {
    return new CourseDtos.CourseResp(c.getId(), c.getTitle(), c.getStartTime(), c.getEndTime(), c.getLocation());
  }
}
