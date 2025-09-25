package com.assignment.server.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.assignment.server.Model.Severity;
import com.assignment.server.Model.UserAlertStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {
    private Long alertId;
    private String title;
    private String message;
    private Severity severity;
    private LocalDateTime startTime;

    private UserAlertStatus status;
    private boolean snoozed;
}