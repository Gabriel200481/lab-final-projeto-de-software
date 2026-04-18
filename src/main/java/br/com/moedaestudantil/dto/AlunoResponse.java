package br.com.moedaestudantil.dto;

import java.util.UUID;

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
