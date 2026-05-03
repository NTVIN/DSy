package com.todo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
@Slf4j
public class JwtProvider {

    private final SecretKey key;
    private final long jwtExpirationMs;
    private final long refreshExpirationMs;
    private final String issuer;
    private final String audience;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long jwtExpirationMs,
            @Value("${jwt.refresh-expiration}") long refreshExpirationMs,
            @Value("${jwt.issuer}") String issuer,
            @Value("${jwt.audience}") String audience) {

        // OWASP: Use proper key derivation
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
        this.issuer = issuer;
        this.audience = audience;

        log.info("JWT Provider initialized - Expiration: {}ms, Issuer: {}, Audience: {}",
                jwtExpirationMs, issuer, audience);
    }

    /**
     * Generate access token
     * OWASP: Include standard claims (iss, aud, exp, iat, jti)
     */
    public String generateTokenFromUsername(String username) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(jwtExpirationMs);

        return Jwts.builder()
                .subject(username)                                    // sub: username
                .issuer(issuer)                                       // iss: token issuer
                .audience().add(audience).and()                       // aud: intended audience
                .issuedAt(Date.from(now))                            // iat: issued at
                .expiration(Date.from(expiration))                   // exp: expiration
                .id(UUID.randomUUID().toString())                    // jti: unique token ID
                .claim("type", "access")                             // Custom: token type
                .signWith(key, Jwts.SIG.HS512)                       // Sign with HS512
                .compact();
    }

    /**
     * Generate refresh token
     * OWASP: Separate refresh token with longer expiration
     */
    public String generateRefreshToken(String username) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(refreshExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuer(issuer)
                .audience().add(audience).and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .id(UUID.randomUUID().toString())
                .claim("type", "refresh")
                .signWith(key, Jwts.SIG.HS512)
                .compact();
    }

    /**
     * Extract username from token
     * OWASP: Validate all claims before extracting data
     */
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = parseAndValidateToken(token);
            return claims.getSubject();
        } catch (JwtException e) {
            log.error("Failed to extract username from token: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Validate token
     * OWASP: Comprehensive validation of all claims
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = parseAndValidateToken(token);

            // OWASP: Validate token type
            String tokenType = claims.get("type", String.class);
            if (!"access".equals(tokenType)) {
                log.warn("Invalid token type: {}", tokenType);
                return false;
            }

            // OWASP: Validate expiration explicitly
            Date expiration = claims.getExpiration();
            if (expiration.before(new Date())) {
                log.warn("Token expired at: {}", expiration);
                return false;
            }

            log.debug("Token validated successfully for user: {}", claims.getSubject());
            return true;

        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        } catch (JwtException e) {
            log.error("JWT validation error: {}", e.getMessage());
        }

        return false;
    }

    /**
     * Parse and validate token with all OWASP checks
     */
    private Claims parseAndValidateToken(String token) {
        return Jwts.parser()
                .verifyWith(key)                                     // Verify signature
                .requireIssuer(issuer)                               // OWASP: Validate issuer
                .requireAudience(audience)                           // OWASP: Validate audience
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Get token expiration time
     */
    public Date getExpirationFromToken(String token) {
        try {
            Claims claims = parseAndValidateToken(token);
            return claims.getExpiration();
        } catch (JwtException e) {
            log.error("Failed to extract expiration from token: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Get token ID (jti claim)
     * OWASP: Used for token revocation/blacklisting
     */
    public String getTokenId(String token) {
        try {
            Claims claims = parseAndValidateToken(token);
            return claims.getId();
        } catch (JwtException e) {
            log.error("Failed to extract token ID: {}", e.getMessage());
            throw e;
        }
    }
}