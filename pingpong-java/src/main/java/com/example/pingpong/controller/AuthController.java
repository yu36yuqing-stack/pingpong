package com.example.pingpong.controller;

import com.example.pingpong.auth.JwtService;
import com.example.pingpong.domain.User;
import com.example.pingpong.domain.UserRole;
import com.example.pingpong.dto.AuthDtos;
import com.example.pingpong.service.UserService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserService userService;
  private final JwtService jwtService;

  public AuthController(UserService userService, JwtService jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  // demo: 微信 code -> openid (stub)
  @PostMapping("/login")
  public AuthDtos.TokenResp login(@RequestBody @Valid AuthDtos.LoginReq req) {
    String openid = "wx_" + req.getCode();
    User u = userService.getOrCreateByOpenid(openid, "微信用户", UserRole.USER);
    return new AuthDtos.TokenResp(jwtService.issue(u));
  }

  // demo: quick login
  @PostMapping("/dev-login")
  public AuthDtos.TokenResp devLogin(@RequestBody @Valid AuthDtos.DevLoginReq req) {
    UserRole role = (req.getRole() != null && req.getRole().equalsIgnoreCase("ADMIN")) ? UserRole.ADMIN : UserRole.USER;
    String openid = "dev_" + req.getName();
    User u = userService.getOrCreateByOpenid(openid, req.getName(), role);
    return new AuthDtos.TokenResp(jwtService.issue(u));
  }
}
