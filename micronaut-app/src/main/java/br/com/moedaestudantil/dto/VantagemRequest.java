package br.com.moedaestudantil.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record VantagemRequest(
        @NotBlank String descricao,
        @NotBlank String fotoUrl,
        @NotNull @DecimalMin(value = "0.01") BigDecimal custoMoedas
) {
}



