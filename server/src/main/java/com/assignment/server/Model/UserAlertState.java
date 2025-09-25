package com.assignment.server.Model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_alert_states", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "alert_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserAlertState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id", nullable = false)
    private Alert alert;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserAlertStatus status = UserAlertStatus.UNREAD;

    private LocalDateTime snoozedUntil;
}