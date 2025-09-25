package com.assignment.server.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.assignment.server.Dto.SnoozeCount;
import com.assignment.server.Model.UserAlertState;
import com.assignment.server.Model.UserAlertStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserAlertStateRepository extends JpaRepository<UserAlertState, Long> {
    Optional<UserAlertState> findByUserIdAndAlertId(Long userId, Long alertId);

    long countByStatus(UserAlertStatus status);

    @Query("SELECT new com.assignment.server.Dto.SnoozeCount(a.title, COUNT(uas.id)) " +
            "FROM UserAlertState uas JOIN uas.alert a " +
            "WHERE uas.snoozedUntil IS NOT NULL " +
            "GROUP BY a.title")
    List<SnoozeCount> countSnoozesPerAlert();

    List<UserAlertState> findByUserIdAndSnoozedUntilIsNotNull(Long userId);

    @Query("SELECT COUNT(DISTINCT uas.user) FROM UserAlertState uas WHERE uas.alert.id = :alertId AND uas.snoozedUntil > :currentTime")
    long countDistinctUsersWithActiveSnoozeByAlertId(@Param("alertId") Long alertId,
            @Param("currentTime") LocalDateTime currentTime);

    List<UserAlertState> findByUserIdAndAlertIdIn(Long userId, List<Long> alertIds);
}