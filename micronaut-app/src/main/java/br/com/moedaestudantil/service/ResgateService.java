package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.ResgateRequest;
import br.com.moedaestudantil.dto.ResgateResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.Cupom;
import br.com.moedaestudantil.model.ResgateVantagem;
import br.com.moedaestudantil.model.Vantagem;
import br.com.moedaestudantil.security.CurrentUserService;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.CupomRepository;
import br.com.moedaestudantil.repository.ResgateVantagemRepository;
import br.com.moedaestudantil.repository.VantagemRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

@Singleton
@SuppressWarnings("null")
public class ResgateService {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final ResgateVantagemRepository resgateVantagemRepository;
    private final CupomRepository cupomRepository;
    private final NotificacaoService notificacaoService;
    private final QrCodeService qrCodeService;
    private final CurrentUserService currentUserService;

    public ResgateService(
            AlunoRepository alunoRepository,
            VantagemRepository vantagemRepository,
            ResgateVantagemRepository resgateVantagemRepository,
            CupomRepository cupomRepository,
            NotificacaoService notificacaoService,
            QrCodeService qrCodeService,
            CurrentUserService currentUserService
    ) {
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.resgateVantagemRepository = resgateVantagemRepository;
        this.cupomRepository = cupomRepository;
        this.notificacaoService = notificacaoService;
        this.qrCodeService = qrCodeService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public ResgateResponse resgatar(ResgateRequest request) {
        Aluno alunoAutenticado = currentUserService.getAuthenticatedAluno();
        if (!alunoAutenticado.getId().equals(request.alunoId())) {
            throw new BusinessException("Aluno autenticado nao pode resgatar vantagem em nome de outro aluno");
        }

        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));

        Vantagem vantagem = vantagemRepository.findByIdAndAtivaTrue(request.vantagemId())
                .orElseThrow(() -> new NotFoundException("Vantagem ativa nao encontrada"));

        BigDecimal custo = vantagem.getCustoMoedas();
        if (aluno.getSaldoAtual().compareTo(custo) < 0) {
            throw new BusinessException("Saldo insuficiente para resgate");
        }

        aluno.setSaldoAtual(aluno.getSaldoAtual().subtract(custo));
        alunoRepository.save(aluno);

        String codigo = gerarCodigoUnico();
        ResgateVantagem resgate = new ResgateVantagem();
        resgate.setAlunoId(aluno.getId());
        resgate.setVantagemId(vantagem.getId());
        resgate.setCodigoUnico(codigo);
        resgate.setDataHora(LocalDateTime.now());
        ResgateVantagem salvo = resgateVantagemRepository.save(resgate);

        String nomeArquivoQr = qrCodeService.gerarNomeArquivoUnico(aluno.getId().getMostSignificantBits() & Long.MAX_VALUE,
                vantagem.getId().getMostSignificantBits() & Long.MAX_VALUE);
        String qrCodeUrl;
        try {
            qrCodeUrl = qrCodeService.gerarQrCode(codigo, nomeArquivoQr);
        } catch (Exception e) {
            throw new BusinessException("Falha ao gerar QR Code do resgate");
        }

        Cupom cupom = new Cupom(codigo, aluno, vantagem, qrCodeUrl);
        cupomRepository.save(cupom);

        notificacaoService.enviarConfirmacaoResgateParaAluno(aluno, codigo, qrCodeUrl);
        notificacaoService.enviarConfirmacaoResgateParaEmpresa(vantagem.getEmpresa(), codigo, vantagem.getDescricao(), qrCodeUrl);

        return new ResgateResponse(
                salvo.getId(),
                salvo.getAlunoId(),
                salvo.getVantagemId(),
                salvo.getCodigoUnico(),
            qrCodeUrl,
                salvo.getDataHora(),
                custo
        );
    }

    public ResgateResponse buscarPorId(UUID id) {
        ResgateVantagem resgate = resgateVantagemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Resgate nao encontrado"));

        Vantagem vantagem = vantagemRepository.findById(resgate.getVantagemId())
                .orElseThrow(() -> new NotFoundException("Vantagem nao encontrada"));

        String qrCodeUrl = cupomRepository.findByCodigo(resgate.getCodigoUnico())
            .map(Cupom::getQrcodeUrl)
            .orElse(null);

        return new ResgateResponse(
                resgate.getId(),
                resgate.getAlunoId(),
                resgate.getVantagemId(),
                resgate.getCodigoUnico(),
            qrCodeUrl,
                resgate.getDataHora(),
                vantagem.getCustoMoedas()
        );
    }

    private String gerarCodigoUnico() {
        String codigo;
        do {
            codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (resgateVantagemRepository.existsByCodigoUnico(codigo));
        return codigo;
    }
}



