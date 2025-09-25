package com.assignment.server.Dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

import com.assignment.server.Model.DeliveryType;
import com.assignment.server.Model.Severity;

@Data
public class CreateAlertRequest {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    @NotNull(message = "Severity must be provided")
    private Severity severity;

    private LocalDateTime startTime;

    private DeliveryType deliveryType;
    private Integer reminderFrequencyMinutes;

    @NotNull(message = "Expiry time must be provided")
    @Future(message = "Expiry time must be in the future")
    private LocalDateTime expiryTime;

    private boolean remindersEnabled;

    private Long targetUserId;
    private Long targetTeamId;
    private boolean organizationWide;
}