package br.com.moedaestudantil.dto;

import java.math.BigDecimal;
import java.util.UUID;

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



