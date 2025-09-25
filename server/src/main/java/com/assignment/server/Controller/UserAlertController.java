package com.assignment.server.Controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.assignment.server.Dto.AlertResponse;
import com.assignment.server.Model.Severity;
import com.assignment.server.Model.User;
import com.assignment.server.Service.UserAlertService;
import com.assignment.server.Service.UserPreferenceService;

@RestController
@RequestMapping("/api/user/alerts")
@RequiredArgsConstructor
public class UserAlertController {

    private final UserPreferenceService userPreferenceService;

    private final UserAlertService userAlertService;

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getMyAlerts(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) Severity severity) {
        return ResponseEntity.ok(userAlertService.getAlertsForUser(currentUser.getId(), severity));
    }

    @PostMapping("/{alertId}/snooze")
    public ResponseEntity<Void> snoozeAlert(@PathVariable Long alertId, @AuthenticationPrincipal User currentUser) {
        userPreferenceService.snoozeAlert(currentUser.getId(), alertId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{alertId}/read")
    public ResponseEntity<Void> markAlertAsRead(@PathVariable Long alertId, @AuthenticationPrincipal User currentUser) {
        userPreferenceService.markAsRead(currentUser.getId(), alertId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/snoozed")
    public ResponseEntity<List<AlertResponse>> getSnoozedAlerts(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userAlertService.getSnoozedAlertsForUser(currentUser.getId()));
    }
}