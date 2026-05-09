package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.SaldoSemestralResponse;
import br.com.moedaestudantil.service.SaldoSemestralService;
import java.util.List;
import java.util.UUID;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Controller;

@Controller("/api/saldo-semestral")
public class SaldoSemestralController {

    private final SaldoSemestralService saldoSemestralService;

    public SaldoSemestralController(SaldoSemestralService saldoSemestralService) {
        this.saldoSemestralService = saldoSemestralService;
    }

    @Post("/aplicar")
    public List<SaldoSemestralResponse> aplicarParaTodos() {
        return saldoSemestralService.aplicarRecargaParaTodos();
    }

    @Post("/professor/{professorId}")
    public SaldoSemestralResponse aplicarParaProfessor(@PathVariable UUID professorId) {
        return saldoSemestralService.aplicarRecargaParaProfessor(professorId);
    }
}



