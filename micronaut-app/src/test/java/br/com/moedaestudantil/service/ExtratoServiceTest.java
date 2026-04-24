package br.com.moedaestudantil.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import br.com.moedaestudantil.dto.ExtratoResumoResponse;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.ResgateVantagem;
import br.com.moedaestudantil.model.TransacaoMoeda;
import br.com.moedaestudantil.model.Vantagem;
import br.com.moedaestudantil.security.CurrentUserService;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.repository.ResgateVantagemRepository;
import br.com.moedaestudantil.repository.TransacaoMoedaRepository;
import br.com.moedaestudantil.repository.VantagemRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class ExtratoServiceTest {

    private ExtratoService extratoService;
    private AlunoRepository alunoRepository;
    private TransacaoMoedaRepository transacaoMoedaRepository;
    private ResgateVantagemRepository resgateVantagemRepository;
    private VantagemRepository vantagemRepository;
    private CurrentUserService currentUserService;

    @BeforeEach
    void setup() {
        transacaoMoedaRepository = Mockito.mock(TransacaoMoedaRepository.class);
        resgateVantagemRepository = Mockito.mock(ResgateVantagemRepository.class);
        vantagemRepository = Mockito.mock(VantagemRepository.class);
        alunoRepository = Mockito.mock(AlunoRepository.class);
        ProfessorRepository professorRepository = Mockito.mock(ProfessorRepository.class);
        currentUserService = Mockito.mock(CurrentUserService.class);

        extratoService = new ExtratoService(
                transacaoMoedaRepository,
                resgateVantagemRepository,
                vantagemRepository,
                alunoRepository,
            professorRepository,
            currentUserService
        );
    }

    @Test
    void deveRetornarExtratoAlunoComRecebimentoEResgate() {
        UUID alunoId = UUID.randomUUID();
        UUID professorId = UUID.randomUUID();
        UUID vantagemId = UUID.randomUUID();

        Aluno aluno = new Aluno();
        aluno.setId(alunoId);
        aluno.setNome("Aluno Teste");
        aluno.setSaldoAtual(BigDecimal.valueOf(20));

        TransacaoMoeda recebimento = new TransacaoMoeda();
        recebimento.setId(UUID.randomUUID());
        recebimento.setRemetenteId(professorId);
        recebimento.setDestinatarioId(alunoId);
        recebimento.setValor(BigDecimal.valueOf(50));
        recebimento.setMensagem("Reconhecimento");
        recebimento.setDataHora(LocalDateTime.now().minusHours(2));

        ResgateVantagem resgate = new ResgateVantagem();
        resgate.setId(UUID.randomUUID());
        resgate.setAlunoId(alunoId);
        resgate.setVantagemId(vantagemId);
        resgate.setCodigoUnico("ABC12345");
        resgate.setDataHora(LocalDateTime.now().minusHours(1));

        Vantagem vantagem = new Vantagem();
        vantagem.setId(vantagemId);
        vantagem.setDescricao("Cupom 10%");
        vantagem.setCustoMoedas(BigDecimal.valueOf(30));

        when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
        when(currentUserService.getAuthenticatedAluno()).thenReturn(aluno);
        when(transacaoMoedaRepository.findByDestinatarioIdOrderByDataHoraDesc(alunoId)).thenReturn(List.of(recebimento));
        when(resgateVantagemRepository.findByAlunoIdOrderByDataHoraDesc(alunoId)).thenReturn(List.of(resgate));
        when(vantagemRepository.findById(vantagemId)).thenReturn(Optional.of(vantagem));

        ExtratoResumoResponse resumo = extratoService.extratoAlunoComResumo(alunoId, null, null);

        assertEquals(2, resumo.transacoes().size());
        assertEquals(BigDecimal.valueOf(20), resumo.totalMoedasPeriodo());
        assertTrue(resumo.transacoes().stream().anyMatch(t -> t.valor().compareTo(BigDecimal.ZERO) < 0));
    }
}
