package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.SaldoSemestralResponse;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.repository.ProfessorRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

@Singleton
@SuppressWarnings("null")
public class SaldoSemestralService {

    private static final BigDecimal RECARGA_SEMESTRAL = BigDecimal.valueOf(1000);
    private final ProfessorRepository professorRepository;

    public SaldoSemestralService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    @Transactional
    public List<SaldoSemestralResponse> aplicarRecargaParaTodos() {
        return professorRepository.findAll().stream()
                .map(this::aplicarRecargaPersistindo)
                .toList();
    }

    @Transactional
    public SaldoSemestralResponse aplicarRecargaParaProfessor(UUID professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new NotFoundException("Professor nao encontrado"));
        return aplicarRecargaPersistindo(professor);
    }

    public BigDecimal aplicarRecarga(Professor professor) {
        BigDecimal novoSaldo = professor.getSaldoAtual().add(RECARGA_SEMESTRAL);
        professor.setSaldoAtual(novoSaldo);
        return novoSaldo;
    }

    private SaldoSemestralResponse aplicarRecargaPersistindo(Professor professor) {
        BigDecimal saldoAnterior = professor.getSaldoAtual();
        BigDecimal saldoAtual = aplicarRecarga(professor);
        Professor salvo = professorRepository.save(professor);
        return new SaldoSemestralResponse(salvo.getId(), saldoAnterior, saldoAtual);
    }
}



