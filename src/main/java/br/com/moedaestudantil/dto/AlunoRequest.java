package br.com.moedaestudantil.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;

public record AlunoRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String senha,
        @NotBlank @Pattern(regexp = "^\\d{11}$", message = "CPF deve ter 11 digitos numericos") String cpf,
        @NotBlank String rg,
        @NotBlank String endereco,
        @NotBlank String curso,
        @NotNull UUID instituicaoId
) {
}
