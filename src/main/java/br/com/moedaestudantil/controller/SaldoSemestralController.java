package br.com.moedaestudantil.controller;

import br.com.moedaestudantil.dto.SaldoSemestralResponse;
import br.com.moedaestudantil.service.SaldoSemestralService;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saldo-semestral")
public class SaldoSemestralController {

    private final SaldoSemestralService saldoSemestralService;

    public SaldoSemestralController(SaldoSemestralService saldoSemestralService) {
        this.saldoSemestralService = saldoSemestralService;
    }

    @PostMapping("/aplicar")
    public List<SaldoSemestralResponse> aplicarParaTodos() {
        return saldoSemestralService.aplicarRecargaParaTodos();
    }

    @PostMapping("/professor/{professorId}")
    public SaldoSemestralResponse aplicarParaProfessor(@PathVariable UUID professorId) {
        return saldoSemestralService.aplicarRecargaParaProfessor(professorId);
    }
}
