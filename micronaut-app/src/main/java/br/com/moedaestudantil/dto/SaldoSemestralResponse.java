package br.com.moedaestudantil.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SaldoSemestralResponse(UUID professorId, BigDecimal saldoAnterior, BigDecimal saldoAtual) {
}



