package com.assignment.server.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assignment.server.Dto.AdminAlertResponse;
import com.assignment.server.Dto.CreateAlertRequest;
import com.assignment.server.Dto.UpdateAlertRequest;
import com.assignment.server.Model.Alert;
import com.assignment.server.Model.AlertVisibility;
import com.assignment.server.Model.Severity;
import com.assignment.server.Repository.AlertRepository;
import com.assignment.server.Repository.AlertVisibilityRepository;
import com.assignment.server.Repository.TeamRepository;
import com.assignment.server.Repository.UserAlertStateRepository;
import com.assignment.server.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AlertManagementService {

    private final AlertRepository alertRepository;
    private final UserAlertStateRepository userAlertStateRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final AlertVisibilityRepository alertVisibilityRepository;

    public AlertManagementService(AlertRepository alertRepository, UserAlertStateRepository userAlertStateRepository,
            TeamRepository teamRepository, UserRepository userRepository,
            AlertVisibilityRepository alertVisibilityRepository) {
        this.alertRepository = alertRepository;
        this.userAlertStateRepository = userAlertStateRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.alertVisibilityRepository = alertVisibilityRepository;
    }

    @Transactional
    public Alert createAlert(CreateAlertRequest request) {
        Alert alert = new Alert();
        alert.setTitle(request.getTitle());
        alert.setMessage(request.getMessage());
        alert.setSeverity(request.getSeverity());
        alert.setStartTime(request.getStartTime());
        alert.setExpiryTime(request.getExpiryTime());
        alert.setRemindersEnabled(request.isRemindersEnabled());
        alert.setDeliveryType(request.getDeliveryType());
        if (request.isRemindersEnabled()) {
            alert.setReminderFrequencyMinutes(request.getReminderFrequencyMinutes());
        }
        Alert savedAlert = alertRepository.save(alert);

        AlertVisibility visibility = new AlertVisibility();
        visibility.setAlert(savedAlert);

        if (request.isOrganizationWide()) {
            visibility.setOrganizationWide(true);
        } else if (request.getTargetTeamId() != null) {
            var team = teamRepository.findById(request.getTargetTeamId())
                    .orElseThrow(() -> new EntityNotFoundException("Team not found"));
            visibility.setTeam(team);
        } else if (request.getTargetUserId() != null) {
            var user = userRepository.findById(request.getTargetUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            visibility.setUser(user);
        }
        alertVisibilityRepository.save(visibility);

        return savedAlert;
    }

    @Transactional
    public Alert updateAlert(Long alertId, UpdateAlertRequest request) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new EntityNotFoundException("Alert not found with id: " + alertId));

        alert.setTitle(request.getTitle());
        alert.setMessage(request.getMessage());
        alert.setSeverity(request.getSeverity());
        alert.setStartTime(request.getStartTime());
        alert.setExpiryTime(request.getExpiryTime());
        alert.setRemindersEnabled(request.getRemindersEnabled());
        alert.setDeliveryType(request.getDeliveryType());
        alert.setReminderFrequencyMinutes(request.getReminderFrequencyMinutes());

        alertVisibilityRepository.deleteByAlertId(alertId);

        AlertVisibility newVisibility = new AlertVisibility();
        newVisibility.setAlert(alert);

        if (request.getOrganizationWide()) {
            newVisibility.setOrganizationWide(true);
        } else if (request.getTargetTeamId() != null) {
            var team = teamRepository.findById(request.getTargetTeamId())
                    .orElseThrow(() -> new EntityNotFoundException("Team not found"));
            newVisibility.setTeam(team);
        } else if (request.getTargetUserId() != null) {
            var user = userRepository.findById(request.getTargetUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            newVisibility.setUser(user);
        }
        alertVisibilityRepository.save(newVisibility);

        return alertRepository.save(alert);
    }

    public List<AdminAlertResponse> getAdminAlerts(Severity severity, String status) {
        List<Alert> allAlerts = alertRepository.findAll();

        return allAlerts.stream()
                .map(this::buildAdminAlertResponse)
                .filter(response -> severity == null || response.getSeverity() == severity)
                .filter(response -> status == null || status.isEmpty() || response.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    private AdminAlertResponse buildAdminAlertResponse(Alert alert) {
        String status = alert.getExpiryTime().isBefore(LocalDateTime.now()) ? "Expired" : "Active";
        long snoozeCount = userAlertStateRepository.countDistinctUsersWithActiveSnoozeByAlertId(alert.getId(),
                LocalDateTime.now());

        List<AlertVisibility> visibilities = alertVisibilityRepository.findByAlert(alert);
        String visibilityString = visibilities.stream().map(v -> {
            if (v.isOrganizationWide())
                return "ORGANIZATION";
            if (v.getTeam() != null)
                return "TEAM: " + v.getTeam().getName();
            if (v.getUser() != null)
                return "USER: " + v.getUser().getName();
            return "Unknown";
        }).collect(Collectors.joining(", "));

        return AdminAlertResponse.builder()
                .id(alert.getId())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .severity(alert.getSeverity())
                .startTime(alert.getStartTime())
                .expiryTime(alert.getExpiryTime())
                .remindersEnabled(alert.isRemindersEnabled())
                .visibility(visibilityString)
                .status(status)
                .snoozeCount(snoozeCount)
                .build();
    }
}