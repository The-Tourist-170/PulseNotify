package com.assignment.server.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.assignment.server.Dto.AnalyticsResponse;
import com.assignment.server.Dto.SnoozeCount;
import com.assignment.server.Model.Severity;
import com.assignment.server.Model.UserAlertStatus;
import com.assignment.server.Repository.AlertRepository;
import com.assignment.server.Repository.NotificationLogRepository;
import com.assignment.server.Repository.UserAlertStateRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AlertRepository alertRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final UserAlertStateRepository userAlertStateRepository;

    public AnalyticsResponse getSystemAnalytics() {
        long totalAlerts = alertRepository.count();
        long totalDelivered = notificationLogRepository.count();
        long totalRead = userAlertStateRepository.countByStatus(UserAlertStatus.READ);

        Map<Severity, Long> severityBreakdown = alertRepository.countBySeverity().stream()
            .collect(Collectors.toMap(
                obj -> (Severity) obj[0],
                obj -> (Long) obj[1]
            ));

        List<SnoozeCount> snoozeCounts = userAlertStateRepository.countSnoozesPerAlert();

        return AnalyticsResponse.builder()
            .totalAlerts(totalAlerts)
            .totalDelivered(totalDelivered)
            .totalRead(totalRead)
            .severityBreakdown(severityBreakdown)
            .snoozeCountsPerAlert(snoozeCounts)
            .build();
    }
}