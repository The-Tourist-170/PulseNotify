package com.assignment.server.Controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assignment.server.Dto.AdminAlertResponse;
import com.assignment.server.Dto.CreateAlertRequest;
import com.assignment.server.Dto.UpdateAlertRequest;
import com.assignment.server.Model.Alert;
import com.assignment.server.Model.Severity;
import com.assignment.server.Service.AlertManagementService;

@RestController
@RequestMapping("/api/admin/alerts")
@RequiredArgsConstructor
public class AdminAlertController {

    @Autowired
    private final AlertManagementService alertManagementService;

    @PutMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(@PathVariable Long id, @RequestBody UpdateAlertRequest request) {
        Alert updatedAlert = alertManagementService.updateAlert(id, request);
        return ResponseEntity.ok(updatedAlert);
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody CreateAlertRequest request) {
        Alert createdAlert = alertManagementService.createAlert(request);
        return ResponseEntity.ok(createdAlert);
    }
 
    @GetMapping
    public ResponseEntity<List<AdminAlertResponse>> listAlerts(
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false) String status) {
        List<AdminAlertResponse> alerts = alertManagementService.getAdminAlerts(severity, status);
        return ResponseEntity.ok(alerts);
    }
}