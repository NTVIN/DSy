package com.todo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class TokenBlacklistService {

    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String tokenId, Date expirationDate) {
        blacklistedTokens.put(tokenId, expirationDate);
        log.info("Token blacklisted: {} (expires: {})", tokenId, expirationDate);
    }

    public boolean isBlacklisted(String tokenId) {
        return blacklistedTokens.containsKey(tokenId);
    }

    private void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().before(now));
    }

    public int getBlacklistSize() {
        cleanupExpiredTokens();
        return blacklistedTokens.size();
    }
}