package com.assignment.server.Dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String name;
    private String password;
    private Long teamId; 
}

