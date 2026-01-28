package com.example.pingpong.dto;

import javax.validation.constraints.NotBlank;

public class AuthDtos {

  public static class DevLoginReq {
    @NotBlank
    private String name;
    private String role;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
  }

  public static class LoginReq {
    @NotBlank
    private String code;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
  }

  public static class TokenResp {
    private String token;

    public TokenResp() {}
    public TokenResp(String token) { this.token = token; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
  }
}
