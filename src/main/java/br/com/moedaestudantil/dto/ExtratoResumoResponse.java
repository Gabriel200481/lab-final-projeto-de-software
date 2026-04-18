package br.com.moedaestudantil.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ExtratoResumoResponse(
        UUID usuarioId,
        String usuarioNome,
        String perfil,
        BigDecimal saldoAtual,
        BigDecimal totalMoedasPeriodo,
        List<TransacaoResponse> transacoes
) {
}
