package com.assignment.server.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.assignment.server.Model.Alert;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long>, JpaSpecificationExecutor<Alert> {

    @Query("SELECT a.severity, COUNT(a) FROM Alert a GROUP BY a.severity")
    List<Object[]> countBySeverity();

    @Query("SELECT a FROM Alert a WHERE a.remindersEnabled = true AND a.startTime <= :now AND a.expiryTime > :now")
    List<Alert> findActiveAlertsWithRemindersEnabled(@Param("now") LocalDateTime now);

    @Query("SELECT a FROM Alert a JOIN AlertVisibility v ON a.id = v.alert.id " +
            "WHERE a.startTime <= :now AND a.expiryTime > :now AND (" +
            "v.organizationWide = true OR " +
            "v.user.id = :userId OR " +
            "v.team.id = (SELECT u.team.id FROM User u WHERE u.id = :userId)" +
            ")")
    List<Alert> findActiveAlertsForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}