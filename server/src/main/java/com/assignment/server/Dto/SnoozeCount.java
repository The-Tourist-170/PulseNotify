package com.assignment.server.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SnoozeCount {
    private String alertTitle;
    private Long count;
}