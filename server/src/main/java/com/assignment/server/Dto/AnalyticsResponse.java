package com.assignment.server.Dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

import com.assignment.server.Model.Severity;

@Data
@Builder
public class AnalyticsResponse {
    private long totalAlerts;
    private long totalDelivered;
    private long totalRead;
    private Map<Severity, Long> severityBreakdown;
    private List<SnoozeCount> snoozeCountsPerAlert;
}