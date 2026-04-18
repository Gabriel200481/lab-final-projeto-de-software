package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.ResgateRequest;
import br.com.moedaestudantil.dto.ResgateResponse;
import br.com.moedaestudantil.service.ResgateService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resgates")
public class ResgateController {

    private final ResgateService resgateService;

    public ResgateController(ResgateService resgateService) {
        this.resgateService = resgateService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResgateResponse resgatar(@Valid @RequestBody ResgateRequest request) {
        return resgateService.resgatar(request);
    }

    @GetMapping("/{id}")
    public ResgateResponse buscarPorId(@PathVariable UUID id) {
        return resgateService.buscarPorId(id);
    }
}
