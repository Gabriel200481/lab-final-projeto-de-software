package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.ProfessorRequest;
import br.com.moedaestudantil.dto.ProfessorResponse;
import br.com.moedaestudantil.service.ProfessorService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public List<ProfessorResponse> listar() {
        return professorService.listar();
    }

    @GetMapping("/{id}")
    public ProfessorResponse buscarPorId(@PathVariable UUID id) {
        return professorService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public ProfessorResponse atualizar(@PathVariable UUID id, @Valid @RequestBody ProfessorRequest request) {
        return professorService.atualizar(id, request);
    }
}
