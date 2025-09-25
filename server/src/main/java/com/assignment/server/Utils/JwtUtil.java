package com.assignment.server.Utils;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

// This is a simplified JWT utility. 
// In a real application, the secret key should be in your application.properties.
@Component
public class JwtUtil {
    private final String SECRET_KEY = "your_super_secret_key_that_is_long_enough";

    public String generateToken(UserDetails userDetails) {
        return SECRET_KEY;
        // ... logic to generate a JWT
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        return null;
        // ... logic to validate the token
    }

    public String extractUsername(String token) {
        return token;
        // ... logic to extract username from token
    }
}