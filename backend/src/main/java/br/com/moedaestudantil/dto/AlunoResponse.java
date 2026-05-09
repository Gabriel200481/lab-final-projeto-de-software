package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.util.UUID;

@Introspected
@Serdeable
public record AlunoResponse(
        UUID id,
        String nome,
        String email,
        String cpf,
        String rg,
        String endereco,
        String curso,
        UUID instituicaoId,
        String instituicaoNome,
        String instituicaoSigla
) {
}



