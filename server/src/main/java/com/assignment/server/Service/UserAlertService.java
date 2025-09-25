package com.assignment.server.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.assignment.server.Dto.AlertResponse;
import com.assignment.server.Model.Alert;
import com.assignment.server.Model.Severity;
import com.assignment.server.Model.UserAlertState;
import com.assignment.server.Model.UserAlertStatus;
import com.assignment.server.Repository.AlertRepository;
import com.assignment.server.Repository.UserAlertStateRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAlertService {

    private final AlertRepository alertRepository;
    private final UserAlertStateRepository userAlertStateRepository;

    public List<AlertResponse> getAlertsForUser(Long userId, Severity severity) {
        List<Alert> alerts = alertRepository.findActiveAlertsForUser(userId, LocalDateTime.now());

        if (severity != null) {
            alerts = alerts.stream()
                    .filter(response -> severity == null || response.getSeverity() == severity)
                    .collect(Collectors.toList());
        }

        List<Long> alertIds = alerts.stream().map(Alert::getId).collect(Collectors.toList());
        Map<Long, UserAlertState> userStates = userAlertStateRepository.findByUserIdAndAlertIdIn(userId, alertIds)
                .stream().collect(Collectors.toMap(state -> state.getAlert().getId(), Function.identity()));

        return alerts.stream().filter(alert -> {
            UserAlertState state = userStates.get(alert.getId());
            boolean isSnoozed = state != null && state.getSnoozedUntil() != null
                    && state.getSnoozedUntil().isAfter(LocalDateTime.now());
            return !isSnoozed;
        }).map(alert -> {
            UserAlertState state = userStates.get(alert.getId());
            return AlertResponse.builder()
                    .alertId(alert.getId())
                    .title(alert.getTitle())
                    .message(alert.getMessage())
                    .severity(alert.getSeverity())
                    .startTime(alert.getStartTime())
                    .status(state != null ? state.getStatus() : UserAlertStatus.UNREAD)
                    .snoozed(false)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<AlertResponse> getSnoozedAlertsForUser(Long userId) {
        List<UserAlertState> snoozedStates = userAlertStateRepository.findByUserIdAndSnoozedUntilIsNotNull(userId);

        return snoozedStates.stream().map(state -> AlertResponse.builder()
                .alertId(state.getAlert().getId())
                .title(state.getAlert().getTitle())
                .message(state.getAlert().getMessage())
                .severity(state.getAlert().getSeverity())
                .startTime(state.getAlert().getStartTime())
                .status(state.getStatus())
                .snoozed(state.getSnoozedUntil() != null && state.getSnoozedUntil().isAfter(LocalDateTime.now()))
                .build())
                .collect(Collectors.toList());
    }
}