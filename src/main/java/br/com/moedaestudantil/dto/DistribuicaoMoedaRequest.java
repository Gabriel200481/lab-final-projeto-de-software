package br.com.moedaestudantil.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record DistribuicaoMoedaRequest(
        @NotNull UUID professorId,
        @NotNull UUID alunoId,
        @NotNull @DecimalMin(value = "0.01") BigDecimal valor,
        @NotBlank String mensagem
) {
}
