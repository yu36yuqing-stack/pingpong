package com.example.pingpong.controller;

import com.example.pingpong.auth.AuthUser;
import com.example.pingpong.service.CheckinService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/scan")
public class ScanController {

  private final CheckinService checkinService;

  public ScanController(CheckinService checkinService) {
    this.checkinService = checkinService;
  }

  @PostMapping("/checkin")
  public Map<String, Object> checkin(@AuthenticationPrincipal AuthUser principal) {
    CheckinService.CheckinResult r = checkinService.checkin(principal.getUserId());
    return new java.util.LinkedHashMap<String, Object>() {{
      put("ok", r.isOk());
      put("courseId", r.getCourseId());
      put("code", r.getCode());
      put("message", r.getMessage());
    }};
  }
}
