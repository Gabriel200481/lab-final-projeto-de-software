package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Introspected
@Serdeable
public record TransacaoResponse(
        UUID id,
        UUID remetenteId,
        String remetenteNome,
        UUID destinatarioId,
        String destinatarioNome,
        BigDecimal valor,
        String mensagem,
        LocalDateTime dataHora
) {
}



