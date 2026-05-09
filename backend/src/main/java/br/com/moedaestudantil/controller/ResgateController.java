package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.ResgateRequest;
import br.com.moedaestudantil.dto.ResgateResponse;
import br.com.moedaestudantil.service.ResgateService;
import jakarta.validation.Valid;
import java.util.UUID;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Status;

@Controller("/api/resgates")
public class ResgateController {

    private final ResgateService resgateService;

    public ResgateController(ResgateService resgateService) {
        this.resgateService = resgateService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public ResgateResponse resgatar(@Valid @Body ResgateRequest request) {
        return resgateService.resgatar(request);
    }

    @Get("/{id}")
    public ResgateResponse buscarPorId(@PathVariable UUID id) {
        return resgateService.buscarPorId(id);
    }
}



