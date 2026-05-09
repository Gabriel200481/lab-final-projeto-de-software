package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.AuthRequest;
import br.com.moedaestudantil.dto.AuthResponse;
import br.com.moedaestudantil.service.AuthService;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Post("/login")
    public AuthResponse login(@Valid @Body AuthRequest request) {
        return authService.login(request);
    }
}



