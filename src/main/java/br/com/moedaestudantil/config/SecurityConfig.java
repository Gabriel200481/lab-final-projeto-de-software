package br.com.moedaestudantil.config;

import br.com.moedaestudantil.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/alunos.html",
                                "/empresas.html",
                            "/app.css",
                            "/app.js",
                                "/h2-console/**",
                                "/health/**",
                                "/api/auth/login",
                                "/api/instituicoes",
                                "/api/qrcodes/**"
                        ).permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/alunos", "/api/empresas").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/transacoes/distribuicao").hasRole("PROFESSOR")
                        .requestMatchers(HttpMethod.GET, "/api/extratos/professores/**").hasRole("PROFESSOR")
                        .requestMatchers(HttpMethod.POST, "/api/saldo-semestral/**").hasRole("PROFESSOR")
                        .requestMatchers(HttpMethod.GET, "/api/extratos/alunos/**").hasRole("ALUNO")
                        .requestMatchers("/api/resgates/**").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.POST, "/api/empresas/*/vantagens").hasRole("EMPRESA")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
