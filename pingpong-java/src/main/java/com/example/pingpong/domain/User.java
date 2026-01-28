package com.example.pingpong.domain;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_openid", columnNames = {"openid"})
})
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 64)
  private String openid;

  @Column(nullable = false, length = 64)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private UserRole role = UserRole.USER;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public String getOpenid() { return openid; }
  public void setOpenid(String openid) { this.openid = openid; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public UserRole getRole() { return role; }
  public void setRole(UserRole role) { this.role = role; }
  public Instant getCreatedAt() { return createdAt; }
}
