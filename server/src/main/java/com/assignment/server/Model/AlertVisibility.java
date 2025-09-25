package com.assignment.server.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alert_visibility")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AlertVisibility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id", nullable = false)
    private Alert alert;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    private boolean organizationWide = false;
}