package br.com.moedaestudantil.dto;

import br.com.moedaestudantil.model.PapelUsuario;
import java.util.UUID;

public record AuthResponse(UUID id, String nome, String email, PapelUsuario papel, String token) {
}
