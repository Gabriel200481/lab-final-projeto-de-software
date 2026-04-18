package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.EmpresaRequest;
import br.com.moedaestudantil.dto.EmpresaResponse;
import br.com.moedaestudantil.dto.VantagemRequest;
import br.com.moedaestudantil.dto.VantagemResponse;
import br.com.moedaestudantil.service.EmpresaService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpresaResponse criar(@Valid @RequestBody EmpresaRequest request) {
        return empresaService.criar(request);
    }

    @GetMapping
    public List<EmpresaResponse> listar() {
        return empresaService.listar();
    }

    @GetMapping("/{id}")
    public EmpresaResponse buscarPorId(@PathVariable UUID id) {
        return empresaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public EmpresaResponse atualizar(@PathVariable UUID id, @Valid @RequestBody EmpresaRequest request) {
        return empresaService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        empresaService.excluir(id);
    }

    @PostMapping("/{id}/vantagens")
    @ResponseStatus(HttpStatus.CREATED)
    public VantagemResponse adicionarVantagem(@PathVariable UUID id, @Valid @RequestBody VantagemRequest request) {
        return empresaService.adicionarVantagem(id, request);
    }

    @GetMapping("/{id}/vantagens")
    public List<VantagemResponse> listarVantagens(@PathVariable UUID id) {
        return empresaService.listarVantagens(id);
    }
}
