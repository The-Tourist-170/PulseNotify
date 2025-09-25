package com.assignment.server.Dto;

import lombok.Data;
import java.time.LocalDateTime;

import com.assignment.server.Model.DeliveryType;
import com.assignment.server.Model.Severity;

@Data
public class UpdateAlertRequest {
    private String title;
    private String message;
    private Severity severity;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private Boolean remindersEnabled;
    private Boolean organizationWide;
    private Long targetUserId;
    private Long targetTeamId;
    private DeliveryType deliveryType;
    private Integer reminderFrequencyMinutes;
}