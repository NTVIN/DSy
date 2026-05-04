package com.todo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OWASP: Token revocation/blacklist mechanism
 * In production, use Redis or a database for distributed systems
 */
@Service
@Slf4j
public class TokenBlacklistService {

    // Store blacklisted token IDs with their expiration time
    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    /**
     * Add token to blacklist (for logout, password change, etc.)
     */
    public void blacklistToken(String tokenId, Date expirationDate) {
        blacklistedTokens.put(tokenId, expirationDate);
        log.info("Token blacklisted: {} (expires: {})", tokenId, expirationDate);

        // Clean up expired tokens
        cleanupExpiredTokens();
    }

    /**
     * Check if token is blacklisted
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void cleanupExpiredTokens() {
        Date now = new Date();
        int removed = 0;

        blacklistedTokens.entrySet().removeIf(entry -> {
            if (entry.getValue().before(now)) {
                removed++;
                return true;
            }
            return false;
        });

        if (removed > 0) {
            log.debug("Removed {} expired tokens from blacklist", removed);
        }
    }

    /**
     * Remove expired tokens from blacklist
     */
    private void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry -> {
            if (entry.getValue().before(now)) {
                log.debug("Removing expired token from blacklist: {}", entry.getKey());
                return true;
            }
            return false;
        });
    }

    /**
     * Get blacklist size (for monitoring)
     */
    public int getBlacklistSize() {
        cleanupExpiredTokens();
        return blacklistedTokens.size();
    }
}