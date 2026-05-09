package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.DistribuicaoMoedaRequest;
import br.com.moedaestudantil.dto.TransacaoResponse;
import br.com.moedaestudantil.service.TransacaoService;
import jakarta.validation.Valid;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Status;

@Controller("/api/transacoes")
public class TransacaoController {

    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @Post("/distribuicao")
    @Status(HttpStatus.CREATED)
    public TransacaoResponse distribuir(@Valid @Body DistribuicaoMoedaRequest request) {
        return transacaoService.distribuirMoedas(request);
    }
}



