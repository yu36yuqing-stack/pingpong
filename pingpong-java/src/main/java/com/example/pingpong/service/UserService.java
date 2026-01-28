package com.example.pingpong.service;

import com.example.pingpong.domain.User;
import com.example.pingpong.domain.UserRole;
import com.example.pingpong.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional
  public User getOrCreateByOpenid(String openid, String name, UserRole role) {
    return userRepository.findByOpenid(openid).orElseGet(() -> {
      User u = new User();
      u.setOpenid(openid);
      u.setName(name == null ? "用户" : name);
      u.setRole(role == null ? UserRole.USER : role);
      return userRepository.save(u);
    });
  }

  public User requireById(Long id) {
    return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("user not found"));
  }
}
