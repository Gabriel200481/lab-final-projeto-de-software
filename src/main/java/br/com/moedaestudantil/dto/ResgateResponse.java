package br.com.moedaestudantil.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

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
