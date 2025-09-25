package com.assignment.server.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.assignment.server.Model.Alert;
import com.assignment.server.Model.User;
import com.assignment.server.Model.UserAlertState;
import com.assignment.server.Model.UserAlertStatus;
import com.assignment.server.Repository.AlertRepository;
import com.assignment.server.Repository.UserAlertStateRepository;
import com.assignment.server.Repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class UserPreferenceService {

    private final UserAlertStateRepository userAlertStateRepository;
    private final UserRepository userRepository;
    private final AlertRepository alertRepository;

    public void snoozeAlert(Long userId, Long alertId) {
        UserAlertState state = getState(userId, alertId);
        state.setSnoozedUntil(LocalDate.now().atTime(LocalTime.MAX)); 
        userAlertStateRepository.save(state);
    }

    public void markAsRead(Long userId, Long alertId) {
        UserAlertState state = getState(userId, alertId);
        state.setStatus(UserAlertStatus.READ);
        userAlertStateRepository.save(state);
    }
    
    private UserAlertState getState(Long userId, Long alertId) {
        return userAlertStateRepository.findByUserIdAndAlertId(userId, alertId)
            .orElseGet(() -> createNewState(userId, alertId));
    }

    private UserAlertState createNewState(Long userId, Long alertId) {
        User user = userRepository.findById(userId).orElseThrow();
        Alert alert = alertRepository.findById(alertId).orElseThrow();
        UserAlertState newState = new UserAlertState();
        newState.setUser(user);
        newState.setAlert(alert);
        return newState;
    }
}
