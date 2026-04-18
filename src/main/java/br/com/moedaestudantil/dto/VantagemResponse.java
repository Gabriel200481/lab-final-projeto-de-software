package br.com.moedaestudantil.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record VantagemResponse(
        UUID id,
        String descricao,
        String fotoUrl,
        BigDecimal custoMoedas,
        boolean ativa
) {
}
