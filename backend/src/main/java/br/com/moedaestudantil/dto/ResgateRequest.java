package br.com.moedaestudantil.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Introspected
@Serdeable
public record ResgateRequest(@NotNull UUID alunoId, @NotNull UUID vantagemId) {
}



