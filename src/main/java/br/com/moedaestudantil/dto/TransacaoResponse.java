package br.com.moedaestudantil.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

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
