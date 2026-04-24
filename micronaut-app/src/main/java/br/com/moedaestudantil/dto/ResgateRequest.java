package br.com.moedaestudantil.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ResgateRequest(@NotNull UUID alunoId, @NotNull UUID vantagemId) {
}



