package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.ExtratoResumoResponse;
import br.com.moedaestudantil.dto.TransacaoResponse;
import br.com.moedaestudantil.service.ExtratoService;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/extratos")
public class ExtratoController {

    private final ExtratoService extratoService;

    public ExtratoController(ExtratoService extratoService) {
        this.extratoService = extratoService;
    }

    @GetMapping("/alunos/{alunoId}")
    public List<TransacaoResponse> extratoAluno(
            @PathVariable UUID alunoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        return extratoService.extratoAluno(alunoId, dataInicio, dataFim);
    }

    @GetMapping("/alunos/{alunoId}/resumo")
    public ExtratoResumoResponse extratoAlunoResumo(
            @PathVariable UUID alunoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        return extratoService.extratoAlunoComResumo(alunoId, dataInicio, dataFim);
    }

    @GetMapping("/professores/{professorId}")
    public List<TransacaoResponse> extratoProfessor(
            @PathVariable UUID professorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        return extratoService.extratoProfessor(professorId, dataInicio, dataFim);
    }

    @GetMapping("/professores/{professorId}/resumo")
    public ExtratoResumoResponse extratoProfessorResumo(
            @PathVariable UUID professorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        return extratoService.extratoProfessorComResumo(professorId, dataInicio, dataFim);
    }
}
