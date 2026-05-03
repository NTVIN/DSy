package com.todo.service;

import com.todo.dto.LoginRequest;
import com.todo.dto.RegisterRequest;
import com.todo.dto.AuthResponse;
import com.todo.entity.User;
import com.todo.repository.UserRepository;
import com.todo.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getEmail());

        String token = jwtProvider.generateTokenFromUsername(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .tokenType("Bearer")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Check password matches
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for user: {}", request.getEmail());
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate JWT token (no authenticationManager needed!)
        String token = jwtProvider.generateTokenFromUsername(user.getUsername());
        log.info("User logged in: {}", user.getEmail());

        // 4. Return response
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .tokenType("Bearer")
                .build();
    }
}