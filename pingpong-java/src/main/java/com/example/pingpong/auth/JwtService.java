package com.example.pingpong.auth;

import com.example.pingpong.domain.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

  private final String issuer;
  private final long ttlSeconds;
  private final Key key;

  public JwtService(
      @Value("${app.jwt.issuer}") String issuer,
      @Value("${app.jwt.ttlSeconds}") long ttlSeconds,
      @Value("${app.jwt.secret}") String secret
  ) {
    this.issuer = issuer;
    this.ttlSeconds = ttlSeconds;
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String issue(User user) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(ttlSeconds);
    return Jwts.builder()
        .setIssuer(issuer)
        .setSubject(String.valueOf(user.getId()))
        .claim("openid", user.getOpenid())
        .claim("role", user.getRole().name())
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(exp))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public Jws<Claims> parse(String token) {
    return Jwts.parserBuilder()
        .requireIssuer(issuer)
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token);
  }
}
