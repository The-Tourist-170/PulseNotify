package com.assignment.server.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.assignment.server.Model.Alert;
import com.assignment.server.Model.AlertVisibility;
import com.assignment.server.Model.NotificationLog;
import com.assignment.server.Model.User;
import com.assignment.server.Model.UserAlertState;
import com.assignment.server.Repository.AlertRepository;
import com.assignment.server.Repository.AlertVisibilityRepository;
import com.assignment.server.Repository.NotificationLogRepository;
import com.assignment.server.Repository.UserAlertStateRepository;
import com.assignment.server.Repository.UserRepository;
import com.assignment.server.Service.NotificationService;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final AlertRepository alertRepository;
    private final AlertVisibilityRepository alertVisibilityRepository;
    private final UserAlertStateRepository userAlertStateRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 120000)
    @Transactional
    public void processAndSendReminders() {
        log.info("Running reminder check at {}", LocalDateTime.now());

        List<Alert> activeAlerts = alertRepository.findActiveAlertsWithRemindersEnabled(LocalDateTime.now());
        if (activeAlerts.isEmpty()) {
            log.info("No active alerts to process.");
            return;
        }

        for (Alert alert : activeAlerts) {
            Set<User> targetAudience = getTargetAudienceFor(alert);

            for (User user : targetAudience) {
                boolean shouldNotify = shouldNotifyUser(user, alert);

                if (shouldNotify) {
                    log.info("Triggering reminder for alert ID {} to user ID {}", alert.getId(), user.getId());
                    notificationService.sendNotification(user, alert);
                }
            }
        }
    }

    private Set<User> getTargetAudienceFor(Alert alert) {
        List<AlertVisibility> visibilities = alertVisibilityRepository.findByAlert(alert);
        Set<User> audience = new HashSet<>();

        for (AlertVisibility visibility : visibilities) {
            if (visibility.isOrganizationWide()) {
                audience.addAll(userRepository.findAll());
                break;
            }
            if (visibility.getTeam() != null) {
                audience.addAll(userRepository.findByTeam(visibility.getTeam()));
            }
            if (visibility.getUser() != null) {
                audience.add(visibility.getUser());
            }
        }
        return audience;
    }

    private boolean shouldNotifyUser(User user, Alert alert) {
        LocalDateTime now = LocalDateTime.now();

        Optional<UserAlertState> state = userAlertStateRepository.findByUserIdAndAlertId(user.getId(), alert.getId());
        if (state.isPresent() && state.get().getSnoozedUntil() != null && state.get().getSnoozedUntil().isAfter(now)) {
            log.debug("Skipping user {} for alert {}: Snoozed.", user.getId(), alert.getId());
            return false;
        }

        Optional<NotificationLog> lastLog = notificationLogRepository
                .findFirstByUserIdAndAlertIdOrderBySentAtDesc(user.getId(), alert.getId());

        int frequency = alert.getReminderFrequencyMinutes() != null ? alert.getReminderFrequencyMinutes() : 120;

        if (lastLog.isPresent() && lastLog.get().getSentAt().isAfter(now.minusMinutes(frequency))) {
            log.debug("Skipping user {} for alert {}: Notified recently.", user.getId(), alert.getId());
            return false;
        }

        return true;
    }

}