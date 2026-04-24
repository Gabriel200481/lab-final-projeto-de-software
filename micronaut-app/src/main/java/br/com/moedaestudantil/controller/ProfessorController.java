package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.ProfessorRequest;
import br.com.moedaestudantil.dto.ProfessorResponse;
import br.com.moedaestudantil.service.ProfessorService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Status;

@Controller("/api/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public ProfessorResponse criar(@Valid @Body ProfessorRequest request) {
        return professorService.criar(request);
    }

    @Get
    public List<ProfessorResponse> listar() {
        return professorService.listar();
    }

    @Get("/{id}")
    public ProfessorResponse buscarPorId(@PathVariable UUID id) {
        return professorService.buscarPorId(id);
    }

    @Put("/{id}")
    public ProfessorResponse atualizar(@PathVariable UUID id, @Valid @Body ProfessorRequest request) {
        return professorService.atualizar(id, request);
    }

    @Delete("/{id}")
    @Status(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        professorService.excluir(id);
    }
}



