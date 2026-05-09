package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.EmpresaRequest;
import br.com.moedaestudantil.dto.EmpresaResponse;
import br.com.moedaestudantil.dto.VantagemRequest;
import br.com.moedaestudantil.dto.VantagemResponse;
import br.com.moedaestudantil.service.EmpresaService;
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

@Controller("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public EmpresaResponse criar(@Valid @Body EmpresaRequest request) {
        return empresaService.criar(request);
    }

    @Get
    public List<EmpresaResponse> listar() {
        return empresaService.listar();
    }

    @Get("/{id}")
    public EmpresaResponse buscarPorId(@PathVariable UUID id) {
        return empresaService.buscarPorId(id);
    }

    @Put("/{id}")
    public EmpresaResponse atualizar(@PathVariable UUID id, @Valid @Body EmpresaRequest request) {
        return empresaService.atualizar(id, request);
    }

    @Delete("/{id}")
    @Status(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        empresaService.excluir(id);
    }

    @Post("/{id}/vantagens")
    @Status(HttpStatus.CREATED)
    public VantagemResponse adicionarVantagem(@PathVariable UUID id, @Valid @Body VantagemRequest request) {
        return empresaService.adicionarVantagem(id, request);
    }

    @Get("/{id}/vantagens")
    public List<VantagemResponse> listarVantagens(@PathVariable UUID id) {
        return empresaService.listarVantagens(id);
    }
}



