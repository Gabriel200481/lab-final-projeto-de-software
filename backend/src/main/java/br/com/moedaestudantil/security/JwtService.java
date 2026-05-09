package br.com.moedaestudantil.security;

import br.com.moedaestudantil.model.Usuario;
import io.micronaut.context.annotation.Value;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import jakarta.inject.Singleton;
import javax.crypto.SecretKey;

@Singleton
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMinutes;

    public JwtService(
            @Value("${micronaut.security.token.jwt.signatures.secret.generator.secret}") String secret,
            @Value("${security.jwt.expiration-minutes:120}") long expirationMinutes
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(Usuario usuario) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationMinutes * 60);

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("id", usuario.getId().toString())
                .claim("papel", usuario.getPapel().name())
            .claim("roles", List.of("ROLE_" + usuario.getPapel().name()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(secretKey)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractPapel(String token) {
        return extractAllClaims(token).get("papel", String.class);
    }
}



