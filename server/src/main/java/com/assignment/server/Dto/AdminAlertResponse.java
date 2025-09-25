package com.assignment.server.Dto;

import com.assignment.server.Model.Severity;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminAlertResponse {
    private Long id;
    private String title;
    private String message;
    private Severity severity;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private boolean remindersEnabled;
    private String visibility;
    private String status;
    private long snoozeCount;
}