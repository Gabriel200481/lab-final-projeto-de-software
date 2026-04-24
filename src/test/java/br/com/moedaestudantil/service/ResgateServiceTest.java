package br.com.moedaestudantil.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import br.com.moedaestudantil.dto.ResgateRequest;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.Cupom;
import br.com.moedaestudantil.model.ResgateVantagem;
import br.com.moedaestudantil.model.Vantagem;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.CupomRepository;
import br.com.moedaestudantil.repository.ResgateVantagemRepository;
import br.com.moedaestudantil.repository.VantagemRepository;
import br.com.moedaestudantil.security.CurrentUserService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ResgateServiceTest {

    private AlunoRepository alunoRepository;
    private VantagemRepository vantagemRepository;
    private ResgateVantagemRepository resgateVantagemRepository;
    private CupomRepository cupomRepository;
    private NotificacaoService notificacaoService;
    private QrCodeService qrCodeService;
    private CurrentUserService currentUserService;
    private ResgateService resgateService;

    @BeforeEach
    void setup() {
        alunoRepository = mock(AlunoRepository.class);
        vantagemRepository = mock(VantagemRepository.class);
        resgateVantagemRepository = mock(ResgateVantagemRepository.class);
        cupomRepository = mock(CupomRepository.class);
        notificacaoService = mock(NotificacaoService.class);
        qrCodeService = mock(QrCodeService.class);
        currentUserService = mock(CurrentUserService.class);

        resgateService = new ResgateService(
                alunoRepository,
                vantagemRepository,
                resgateVantagemRepository,
                cupomRepository,
                notificacaoService,
                qrCodeService,
                currentUserService
        );
    }

    @Test
    void deveBloquearConsultaDeResgateDeOutroAluno() {
        UUID alunoAutenticadoId = UUID.randomUUID();
        UUID outroAlunoId = UUID.randomUUID();
        UUID resgateId = UUID.randomUUID();

        Aluno alunoAutenticado = new Aluno();
        alunoAutenticado.setId(alunoAutenticadoId);

        ResgateVantagem resgate = new ResgateVantagem();
        resgate.setId(resgateId);
        resgate.setAlunoId(outroAlunoId);
        resgate.setVantagemId(UUID.randomUUID());
        resgate.setCodigoUnico("ABC12345");
        resgate.setDataHora(LocalDateTime.now());

        when(currentUserService.getAuthenticatedAluno()).thenReturn(alunoAutenticado);
        when(resgateVantagemRepository.findById(resgateId)).thenReturn(Optional.of(resgate));

        BusinessException exception = assertThrows(BusinessException.class, () -> resgateService.buscarPorId(resgateId));

        assertEquals("Aluno autenticado nao pode consultar resgate de outro aluno", exception.getMessage());
    }

    @Test
    void deveResgatarQuandoAlunoAutenticadoCorrespondeAoRequest() throws Exception {
        UUID alunoId = UUID.randomUUID();
        UUID vantagemId = UUID.randomUUID();

        Aluno aluno = new Aluno();
        aluno.setId(alunoId);
        aluno.setNome("Aluno Teste");
        aluno.setEmail("aluno@lab03.com");
        aluno.setSaldoAtual(BigDecimal.valueOf(100));

        Vantagem vantagem = new Vantagem();
        vantagem.setId(vantagemId);
        vantagem.setDescricao("Cupom");
        vantagem.setCustoMoedas(BigDecimal.valueOf(30));
        vantagem.setAtiva(true);

        Cupom cupom = new Cupom("ABC12345", aluno, vantagem, "http://localhost/qrcode.png");

        when(currentUserService.getAuthenticatedAluno()).thenReturn(aluno);
        when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findByIdAndAtivaTrue(vantagemId)).thenReturn(Optional.of(vantagem));
        when(resgateVantagemRepository.existsByCodigoUnico("ABC12345")).thenReturn(false);
        when(resgateVantagemRepository.save(org.mockito.ArgumentMatchers.any(ResgateVantagem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cupomRepository.save(org.mockito.ArgumentMatchers.any(Cupom.class))).thenReturn(cupom);
        when(qrCodeService.gerarNomeArquivoUnico(org.mockito.ArgumentMatchers.anyLong(), org.mockito.ArgumentMatchers.anyLong())).thenReturn("arquivo-teste");
        when(qrCodeService.gerarQrCode(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyString())).thenReturn("http://localhost/qrcode.png");

        assertEquals(alunoId, resgateService.resgatar(new ResgateRequest(alunoId, vantagemId)).alunoId());
    }
}