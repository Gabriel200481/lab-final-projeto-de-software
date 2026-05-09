package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.AlunoRequest;
import br.com.moedaestudantil.dto.AlunoResponse;
import br.com.moedaestudantil.service.AlunoService;
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

@Controller("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public AlunoResponse criar(@Valid @Body AlunoRequest request) {
        return alunoService.criar(request);
    }

    @Get
    public List<AlunoResponse> listar() {
        return alunoService.listar();
    }

    @Get("/{id}")
    public AlunoResponse buscarPorId(@PathVariable UUID id) {
        return alunoService.buscarPorId(id);
    }

    @Put("/{id}")
    public AlunoResponse atualizar(@PathVariable UUID id, @Valid @Body AlunoRequest request) {
        return alunoService.atualizar(id, request);
    }

    @Delete("/{id}")
    @Status(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        alunoService.excluir(id);
    }
}



