package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.InstituicaoResponse;
import br.com.moedaestudantil.service.InstituicaoService;
import java.util.List;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Controller;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoService instituicaoService;

    public InstituicaoController(InstituicaoService instituicaoService) {
        this.instituicaoService = instituicaoService;
    }

    @Get
    public List<InstituicaoResponse> listar() {
        return instituicaoService.listar();
    }
}



