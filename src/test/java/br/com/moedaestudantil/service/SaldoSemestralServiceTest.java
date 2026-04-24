package br.com.moedaestudantil.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import br.com.moedaestudantil.dto.SaldoSemestralResponse;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.repository.ProfessorRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SaldoSemestralServiceTest {

    private ProfessorRepository professorRepository;
    private SaldoSemestralService saldoSemestralService;

    @BeforeEach
    void setup() {
        professorRepository = mock(ProfessorRepository.class);
        saldoSemestralService = new SaldoSemestralService(professorRepository);
    }

    @Test
    void deveAplicarRecargaDeMilMoedas() {
        Professor professor = new Professor();
        professor.setSaldoAtual(BigDecimal.valueOf(250));

        BigDecimal saldoAtual = saldoSemestralService.aplicarRecarga(professor);

        assertEquals(BigDecimal.valueOf(1250), saldoAtual);
        assertEquals(BigDecimal.valueOf(1250), professor.getSaldoAtual());
    }

    @Test
    void deveLancarQuandoProfessorNaoEncontrado() {
        UUID id = UUID.randomUUID();
        when(professorRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> saldoSemestralService.aplicarRecargaParaProfessor(id));
    }

    @Test
    void deveAplicarRecargaParaProfessorEncontrado() {
        UUID id = UUID.randomUUID();
        Professor professor = new Professor();
        professor.setId(id);
        professor.setSaldoAtual(BigDecimal.valueOf(100));

        when(professorRepository.findById(id)).thenReturn(Optional.of(professor));
        when(professorRepository.save(any(Professor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SaldoSemestralResponse response = saldoSemestralService.aplicarRecargaParaProfessor(id);

        assertEquals(id, response.professorId());
        assertEquals(BigDecimal.valueOf(100), response.saldoAnterior());
        assertEquals(BigDecimal.valueOf(1100), response.saldoAtual());
    }

    @Test
    void deveAplicarRecargaParaTodosProfessores() {
        Professor p1 = new Professor();
        p1.setId(UUID.randomUUID());
        p1.setSaldoAtual(BigDecimal.ZERO);

        Professor p2 = new Professor();
        p2.setId(UUID.randomUUID());
        p2.setSaldoAtual(BigDecimal.valueOf(500));

        when(professorRepository.findAll()).thenReturn(List.of(p1, p2));
        when(professorRepository.save(any(Professor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<SaldoSemestralResponse> respostas = saldoSemestralService.aplicarRecargaParaTodos();

        assertEquals(2, respostas.size());
        assertEquals(BigDecimal.valueOf(1000), respostas.get(0).saldoAtual());
        assertEquals(BigDecimal.valueOf(1500), respostas.get(1).saldoAtual());
    }
}
