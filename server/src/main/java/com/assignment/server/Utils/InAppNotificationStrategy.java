package com.assignment.server.Utils;

import com.assignment.server.Model.Alert;
import com.assignment.server.Model.DeliveryType; // <-- Import the enum
import com.assignment.server.Model.NotificationLog;
import com.assignment.server.Model.User;
import com.assignment.server.Repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class InAppNotificationStrategy implements NotificationStrategy {

    private final NotificationLogRepository notificationLogRepository;

    @Override
    public void send(User user, Alert alert) {
        log.info("Sending IN_APP notification for alert '{}' to user '{}'", alert.getTitle(), user.getName());

        NotificationLog logEntry = NotificationLog.builder()
            .user(user)
            .alert(alert)
            .channel(com.assignment.server.Model.NotificationChannel.IN_APP) 
            .sentAt(LocalDateTime.now())
            .build();

        notificationLogRepository.save(logEntry);
    }

    @Override
    public DeliveryType getChannelType() { 
        return DeliveryType.IN_APP;
    }
}