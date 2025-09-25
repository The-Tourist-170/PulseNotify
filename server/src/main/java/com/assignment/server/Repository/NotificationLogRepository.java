package com.assignment.server.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assignment.server.Model.NotificationLog;

import java.util.Optional;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    Optional<NotificationLog> findFirstByUserIdAndAlertIdOrderBySentAtDesc(Long userId, Long alertId);
}