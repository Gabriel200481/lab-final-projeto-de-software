package br.com.moedaestudantil.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import br.com.moedaestudantil.model.PapelUsuario;
import br.com.moedaestudantil.model.Usuario;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setup() {
        jwtService = new JwtService("Lab03JwtSecretKeyMuitoSeguraCom32CaracteresMinimo123", 120);
    }

    @Test
    void deveGerarTokenValidoComClaimsEsperadas() {
        Usuario usuario = new UsuarioFake();
        usuario.setId(UUID.randomUUID());
        usuario.setEmail("usuario.teste@lab03.com");
        usuario.setPapel(PapelUsuario.ALUNO);

        String token = jwtService.generateToken(usuario);

        assertTrue(jwtService.isTokenValid(token));
        assertEquals("usuario.teste@lab03.com", jwtService.extractEmail(token));
        assertEquals("ALUNO", jwtService.extractPapel(token));
    }

    private static class UsuarioFake extends Usuario {
    }
}
