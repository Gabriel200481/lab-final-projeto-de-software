package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Introspected
@Serdeable
public record ExtratoResumoResponse(
        UUID usuarioId,
        String usuarioNome,
        String perfil,
        BigDecimal saldoAtual,
        BigDecimal totalMoedasPeriodo,
        List<TransacaoResponse> transacoes
) {
}



