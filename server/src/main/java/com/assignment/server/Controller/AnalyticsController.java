package com.assignment.server.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assignment.server.Dto.AnalyticsResponse;
import com.assignment.server.Service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getSystemAnalytics());
    }
}