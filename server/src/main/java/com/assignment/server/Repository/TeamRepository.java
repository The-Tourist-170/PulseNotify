package com.assignment.server.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assignment.server.Model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}