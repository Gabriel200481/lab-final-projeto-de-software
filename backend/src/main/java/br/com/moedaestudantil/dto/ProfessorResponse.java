package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.util.UUID;

@Introspected
@Serdeable
public record ProfessorResponse(
        UUID id,
        String nome,
        String email,
        String cpf,
        String departamento,
        UUID instituicaoId,
        String instituicaoNome,
        String instituicaoSigla,
        BigDecimal saldoAtual
) {
}



