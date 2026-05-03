package com.todo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;  // NEW
    private String username;
    private String email;
    private String tokenType;
    private Long expiresIn;       // NEW: seconds until expiration
}