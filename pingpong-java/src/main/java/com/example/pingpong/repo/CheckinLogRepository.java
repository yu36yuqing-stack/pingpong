package com.example.pingpong.repo;

import com.example.pingpong.domain.CheckinLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckinLogRepository extends JpaRepository<CheckinLog, Long> {
}
