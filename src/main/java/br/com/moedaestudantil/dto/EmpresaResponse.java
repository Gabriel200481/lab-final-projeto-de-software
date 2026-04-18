package br.com.moedaestudantil.dto;

import java.util.List;
import java.util.UUID;

public record EmpresaResponse(
        UUID id,
        String nome,
        String email,
        String nomeFantasia,
        List<VantagemResponse> vantagens
) {
}
