package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.ExtratoResumoResponse;
import br.com.moedaestudantil.dto.TransacaoResponse;
import br.com.moedaestudantil.service.ExtratoService;
import io.micronaut.core.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.http.annotation.Controller;

@Controller("/api/extratos")
public class ExtratoController {

    private final ExtratoService extratoService;

    public ExtratoController(ExtratoService extratoService) {
        this.extratoService = extratoService;
    }

    @Get("/alunos/{alunoId}")
    public List<TransacaoResponse> extratoAluno(
            @PathVariable UUID alunoId,
            @Nullable @QueryValue LocalDate dataInicio,
            @Nullable @QueryValue LocalDate dataFim
    ) {
        return extratoService.extratoAluno(alunoId, dataInicio, dataFim);
    }

    @Get("/alunos/{alunoId}/resumo")
    public ExtratoResumoResponse extratoAlunoResumo(
            @PathVariable UUID alunoId,
            @Nullable @QueryValue LocalDate dataInicio,
            @Nullable @QueryValue LocalDate dataFim
    ) {
        return extratoService.extratoAlunoComResumo(alunoId, dataInicio, dataFim);
    }

    @Get("/professores/{professorId}")
    public List<TransacaoResponse> extratoProfessor(
            @PathVariable UUID professorId,
            @Nullable @QueryValue LocalDate dataInicio,
            @Nullable @QueryValue LocalDate dataFim
    ) {
        return extratoService.extratoProfessor(professorId, dataInicio, dataFim);
    }

    @Get("/professores/{professorId}/resumo")
    public ExtratoResumoResponse extratoProfessorResumo(
            @PathVariable UUID professorId,
            @Nullable @QueryValue LocalDate dataInicio,
            @Nullable @QueryValue LocalDate dataFim
    ) {
        return extratoService.extratoProfessorComResumo(professorId, dataInicio, dataFim);
    }
}



