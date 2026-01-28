package com.example.pingpong.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

public class AuthUser {
  private final Long userId;
  private final String openid;
  private final String role;

  public AuthUser(Long userId, String openid, String role) {
    this.userId = userId;
    this.openid = openid;
    this.role = role;
  }

  public Long getUserId() { return userId; }
  public String getOpenid() { return openid; }
  public String getRole() { return role; }

  public Collection<? extends GrantedAuthority> authorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role));
  }
}
