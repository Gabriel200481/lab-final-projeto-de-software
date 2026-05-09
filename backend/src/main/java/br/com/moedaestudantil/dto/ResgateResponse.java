package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Introspected
@Serdeable
public record ResgateResponse(
        UUID id,
        UUID alunoId,
        UUID vantagemId,
        String codigoUnico,
        String qrCodeUrl,
        LocalDateTime dataHora,
        BigDecimal valorDebitado
) {
}



