package br.com.moedaestudantil.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.security.CurrentUserService;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.repository.TransacaoMoedaRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TransacaoServiceTest {

    private TransacaoService transacaoService;

    @BeforeEach
    void setup() {
        ProfessorRepository professorRepository = mock(ProfessorRepository.class);
        AlunoRepository alunoRepository = mock(AlunoRepository.class);
        TransacaoMoedaRepository transacaoMoedaRepository = mock(TransacaoMoedaRepository.class);
        NotificacaoService notificacaoService = mock(NotificacaoService.class);
        CurrentUserService currentUserService = mock(CurrentUserService.class);
        transacaoService = new TransacaoService(
                professorRepository,
                alunoRepository,
                transacaoMoedaRepository,
            notificacaoService,
            currentUserService
        );
    }

    @Test
    void deveLancarQuandoMensagemVazia() {
        Professor professor = new Professor();
        professor.setSaldoAtual(BigDecimal.valueOf(1000));

        assertThrows(BusinessException.class,
                () -> transacaoService.validarDistribuicao(professor, BigDecimal.valueOf(100), " "));
    }

    @Test
    void deveLancarQuandoSaldoInsuficiente() {
        Professor professor = new Professor();
        professor.setSaldoAtual(BigDecimal.valueOf(50));

        assertThrows(BusinessException.class,
                () -> transacaoService.validarDistribuicao(professor, BigDecimal.valueOf(100), "Bom desempenho"));
    }

    @Test
    void deveValidarComSucessoQuandoDadosCorretos() {
        Professor professor = new Professor();
        professor.setSaldoAtual(BigDecimal.valueOf(500));

        assertDoesNotThrow(() -> transacaoService.validarDistribuicao(
                professor,
                BigDecimal.valueOf(100),
                "Reconhecimento por participacao"
        ));
    }
}
