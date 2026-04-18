package br.com.moedaestudantil.dto;

import java.util.UUID;

public record InstituicaoResponse(UUID id, String nome, String sigla) {
}
