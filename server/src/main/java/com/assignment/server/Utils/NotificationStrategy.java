package com.assignment.server.Utils;

import com.assignment.server.Model.Alert;
import com.assignment.server.Model.DeliveryType; 
import com.assignment.server.Model.User;

public interface NotificationStrategy {
    void send(User user, Alert alert);
    DeliveryType getChannelType(); 
}