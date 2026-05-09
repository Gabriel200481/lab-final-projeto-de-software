package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import br.com.moedaestudantil.model.PapelUsuario;
import java.util.UUID;

@Introspected
@Serdeable
public record AuthResponse(UUID id, String nome, String email, PapelUsuario papel, String token) {
}



