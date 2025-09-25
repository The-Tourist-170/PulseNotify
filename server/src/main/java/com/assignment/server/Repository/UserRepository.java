package com.assignment.server.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assignment.server.Model.Team;
import com.assignment.server.Model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByTeam(Team team);
    Optional<User> findByName(String name); 
}