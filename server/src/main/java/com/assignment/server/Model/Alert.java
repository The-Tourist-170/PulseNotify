package com.assignment.server.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DeliveryType deliveryType;

    private Integer reminderFrequencyMinutes;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private boolean remindersEnabled;
}