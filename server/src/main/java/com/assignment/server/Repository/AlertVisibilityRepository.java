package com.assignment.server.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assignment.server.Model.Alert;
import com.assignment.server.Model.AlertVisibility;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface AlertVisibilityRepository extends JpaRepository<AlertVisibility, Long> {
    List<AlertVisibility> findByAlert(Alert alert);

    @Transactional
    @Modifying
    @Query("DELETE FROM AlertVisibility av WHERE av.alert.id = :alertId")
    void deleteByAlertId(Long alertId);
}