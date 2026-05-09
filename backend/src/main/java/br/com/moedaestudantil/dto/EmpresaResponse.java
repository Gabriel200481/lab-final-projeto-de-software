package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.util.List;
import java.util.UUID;

@Introspected
@Serdeable
public record EmpresaResponse(
        UUID id,
        String nome,
        String email,
        String nomeFantasia,
        List<VantagemResponse> vantagens
) {
}



