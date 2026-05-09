package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Introspected
@Serdeable
public record EmpresaRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String senha,
        @NotBlank String nomeFantasia
) {
}



