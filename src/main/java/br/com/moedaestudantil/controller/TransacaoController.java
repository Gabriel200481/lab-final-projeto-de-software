package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.DistribuicaoMoedaRequest;
import br.com.moedaestudantil.dto.TransacaoResponse;
import br.com.moedaestudantil.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @PostMapping("/distribuicao")
    @ResponseStatus(HttpStatus.CREATED)
    public TransacaoResponse distribuir(@Valid @RequestBody DistribuicaoMoedaRequest request) {
        return transacaoService.distribuirMoedas(request);
    }
}
