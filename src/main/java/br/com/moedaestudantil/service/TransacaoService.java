package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.DistribuicaoMoedaRequest;
import br.com.moedaestudantil.dto.TransacaoResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.model.TransacaoMoeda;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.repository.TransacaoMoedaRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@SuppressWarnings("null")
public class TransacaoService {

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoMoedaRepository transacaoMoedaRepository;
    private final NotificacaoService notificacaoService;

    public TransacaoService(
            ProfessorRepository professorRepository,
            AlunoRepository alunoRepository,
            TransacaoMoedaRepository transacaoMoedaRepository,
            NotificacaoService notificacaoService
    ) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoMoedaRepository = transacaoMoedaRepository;
        this.notificacaoService = notificacaoService;
    }

    @Transactional
    public TransacaoResponse distribuirMoedas(DistribuicaoMoedaRequest request) {
        Professor professor = professorRepository.findById(request.professorId())
                .orElseThrow(() -> new NotFoundException("Professor nao encontrado"));

        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));

        validarDistribuicao(professor, request.valor(), request.mensagem());

        professor.setSaldoAtual(professor.getSaldoAtual().subtract(request.valor()));
        aluno.setSaldoAtual(aluno.getSaldoAtual().add(request.valor()));
        professorRepository.save(professor);
        alunoRepository.save(aluno);

        TransacaoMoeda transacao = new TransacaoMoeda();
        transacao.setRemetenteId(professor.getId());
        transacao.setDestinatarioId(aluno.getId());
        transacao.setValor(request.valor());
        transacao.setMensagem(request.mensagem());
        transacao.setDataHora(LocalDateTime.now());

        TransacaoMoeda salva = transacaoMoedaRepository.save(transacao);
        notificacaoService.enviarRecebimentoMoedasParaAluno(aluno, request.valor(), request.mensagem());
        notificacaoService.enviarConfirmacaoDistribuicaoParaProfessor(professor, aluno, request.valor(), request.mensagem());

        return new TransacaoResponse(
                salva.getId(),
                salva.getRemetenteId(),
                professor.getNome(),
                salva.getDestinatarioId(),
                aluno.getNome(),
                salva.getValor(),
                salva.getMensagem(),
                salva.getDataHora()
        );
    }

    public void validarDistribuicao(Professor professor, BigDecimal valor, String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new BusinessException("Mensagem de justificativa e obrigatoria");
        }
        if (valor == null || valor.signum() <= 0) {
            throw new BusinessException("Valor da distribuicao deve ser maior que zero");
        }
        if (professor.getSaldoAtual().compareTo(valor) < 0) {
            throw new BusinessException("Saldo insuficiente para distribuicao");
        }
    }
}
