package com.assignment.server.Service;

import org.springframework.stereotype.Service;

import com.assignment.server.Model.Alert;
import com.assignment.server.Model.DeliveryType;
import com.assignment.server.Model.User;
import com.assignment.server.Utils.NotificationStrategy;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final Map<DeliveryType, NotificationStrategy> strategies;

    public NotificationService(List<NotificationStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(NotificationStrategy::getChannelType, Function.identity()));
    }

    public void sendNotification(User user, Alert alert) {
        DeliveryType deliveryType = alert.getDeliveryType() != null ? alert.getDeliveryType() : DeliveryType.IN_APP;

        NotificationStrategy strategy = strategies.get(deliveryType); 

        if (strategy != null) {
            strategy.send(user, alert);
        } else {
            System.out.println("WARN: No notification strategy found for delivery type: " + deliveryType);
        }
    }
}