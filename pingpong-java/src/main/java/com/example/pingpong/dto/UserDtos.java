package com.example.pingpong.dto;

import java.time.Instant;

public class UserDtos {
  public static class ProfileResp {
    private Long id;
    private String openid;
    private String name;
    private String role;
    private Instant createdAt;

    public ProfileResp() {}

    public ProfileResp(Long id, String openid, String name, String role, Instant createdAt) {
      this.id = id;
      this.openid = openid;
      this.name = name;
      this.role = role;
      this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOpenid() { return openid; }
    public void setOpenid(String openid) { this.openid = openid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  }
}
