package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.InstituicaoResponse;
import br.com.moedaestudantil.service.InstituicaoService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoService instituicaoService;

    public InstituicaoController(InstituicaoService instituicaoService) {
        this.instituicaoService = instituicaoService;
    }

    @GetMapping
    public List<InstituicaoResponse> listar() {
        return instituicaoService.listar();
    }
}
