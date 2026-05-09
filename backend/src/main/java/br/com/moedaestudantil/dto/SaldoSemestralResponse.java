package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.util.UUID;

@Introspected
@Serdeable
public record SaldoSemestralResponse(UUID professorId, BigDecimal saldoAnterior, BigDecimal saldoAtual) {
}



