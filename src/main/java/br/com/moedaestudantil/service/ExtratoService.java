package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.ExtratoResumoResponse;
import br.com.moedaestudantil.dto.TransacaoResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.model.ResgateVantagem;
import br.com.moedaestudantil.model.TransacaoMoeda;
import br.com.moedaestudantil.security.CurrentUserService;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.repository.ResgateVantagemRepository;
import br.com.moedaestudantil.repository.TransacaoMoedaRepository;
import br.com.moedaestudantil.repository.VantagemRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class ExtratoService {

    private final TransacaoMoedaRepository transacaoMoedaRepository;
        private final ResgateVantagemRepository resgateVantagemRepository;
        private final VantagemRepository vantagemRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
        private final CurrentUserService currentUserService;

    public ExtratoService(
            TransacaoMoedaRepository transacaoMoedaRepository,
                        ResgateVantagemRepository resgateVantagemRepository,
                        VantagemRepository vantagemRepository,
            AlunoRepository alunoRepository,
                        ProfessorRepository professorRepository,
                        CurrentUserService currentUserService
    ) {
        this.transacaoMoedaRepository = transacaoMoedaRepository;
                this.resgateVantagemRepository = resgateVantagemRepository;
                this.vantagemRepository = vantagemRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
                this.currentUserService = currentUserService;
    }

        public List<TransacaoResponse> extratoAluno(UUID alunoId, LocalDate dataInicio, LocalDate dataFim) {
                Aluno alunoAutenticado = currentUserService.getAuthenticatedAluno();
                if (!alunoAutenticado.getId().equals(alunoId)) {
                        throw new BusinessException("Aluno autenticado nao pode consultar extrato de outro aluno");
                }

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));

                validarPeriodo(dataInicio, dataFim);

                List<TransacaoMoeda> transacoes;
                List<ResgateVantagem> resgates;
                if (dataInicio != null) {
                        LocalDateTime inicio = dataInicio.atStartOfDay();
                        LocalDateTime fim = dataFim.plusDays(1).atStartOfDay().minusNanos(1);
                        transacoes = transacaoMoedaRepository.findByDestinatarioIdAndDataHoraBetweenOrderByDataHoraDesc(
                                        aluno.getId(),
                                        inicio,
                                        fim
                        );
                        resgates = resgateVantagemRepository.findByAlunoIdAndDataHoraBetweenOrderByDataHoraDesc(
                                aluno.getId(),
                                inicio,
                                fim
                        );
                } else {
                        transacoes = transacaoMoedaRepository.findByDestinatarioIdOrderByDataHoraDesc(aluno.getId());
                        resgates = resgateVantagemRepository.findByAlunoIdOrderByDataHoraDesc(aluno.getId());
                }

                List<TransacaoResponse> historico = new ArrayList<>();
                historico.addAll(transacoes.stream().map(this::toResponse).toList());
                historico.addAll(resgates.stream().map(r -> toResponseResgate(aluno, r)).toList());
                historico.sort(Comparator.comparing(TransacaoResponse::dataHora).reversed());

                return historico;
    }

    public ExtratoResumoResponse extratoAlunoComResumo(UUID alunoId, LocalDate dataInicio, LocalDate dataFim) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));
        List<TransacaoResponse> transacoes = extratoAluno(alunoId, dataInicio, dataFim);
        BigDecimal totalMoedasPeriodo = transacoes.stream()
                .map(TransacaoResponse::valor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ExtratoResumoResponse(
                aluno.getId(),
                aluno.getNome(),
                "ALUNO",
                aluno.getSaldoAtual(),
                totalMoedasPeriodo,
                transacoes
        );
    }

        public List<TransacaoResponse> extratoProfessor(UUID professorId, LocalDate dataInicio, LocalDate dataFim) {
                Professor professorAutenticado = currentUserService.getAuthenticatedProfessor();
                if (!professorAutenticado.getId().equals(professorId)) {
                        throw new BusinessException("Professor autenticado nao pode consultar extrato de outro professor");
                }

        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new NotFoundException("Professor nao encontrado"));

                validarPeriodo(dataInicio, dataFim);

                List<TransacaoMoeda> transacoes;
                if (dataInicio != null) {
                        LocalDateTime inicio = dataInicio.atStartOfDay();
                        LocalDateTime fim = dataFim.plusDays(1).atStartOfDay().minusNanos(1);
                        transacoes = transacaoMoedaRepository.findByRemetenteIdAndDataHoraBetweenOrderByDataHoraDesc(
                                        professor.getId(),
                                        inicio,
                                        fim
                        );
                } else {
                        transacoes = transacaoMoedaRepository.findByRemetenteIdOrderByDataHoraDesc(professor.getId());
                }

                return transacoes.stream()
                .map(this::toResponse)
                .toList();
    }

    public ExtratoResumoResponse extratoProfessorComResumo(UUID professorId, LocalDate dataInicio, LocalDate dataFim) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new NotFoundException("Professor nao encontrado"));
        List<TransacaoResponse> transacoes = extratoProfessor(professorId, dataInicio, dataFim);
        BigDecimal totalMoedasPeriodo = transacoes.stream()
                .map(TransacaoResponse::valor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ExtratoResumoResponse(
                professor.getId(),
                professor.getNome(),
                "PROFESSOR",
                professor.getSaldoAtual(),
                totalMoedasPeriodo,
                transacoes
        );
    }

        private void validarPeriodo(LocalDate dataInicio, LocalDate dataFim) {
                if ((dataInicio == null && dataFim != null) || (dataInicio != null && dataFim == null)) {
                        throw new BusinessException("Para filtrar por periodo, informe dataInicio e dataFim");
                }
                if (dataInicio != null && dataFim != null && dataFim.isBefore(dataInicio)) {
                        throw new BusinessException("dataFim nao pode ser anterior a dataInicio");
                }
        }

    private TransacaoResponse toResponse(TransacaoMoeda t) {
        String remetenteNome = professorRepository.findById(t.getRemetenteId())
                .map(Professor::getNome)
                .orElse("Desconhecido");

        String destinatarioNome = alunoRepository.findById(t.getDestinatarioId())
                .map(Aluno::getNome)
                .orElse("Desconhecido");

        return new TransacaoResponse(
                t.getId(),
                t.getRemetenteId(),
                remetenteNome,
                t.getDestinatarioId(),
                destinatarioNome,
                t.getValor(),
                t.getMensagem(),
                t.getDataHora()
        );
    }

    private TransacaoResponse toResponseResgate(Aluno aluno, ResgateVantagem resgate) {
        var vantagemOpt = vantagemRepository.findById(resgate.getVantagemId());
        BigDecimal valorDebitado = vantagemOpt.map(v -> v.getCustoMoedas()).orElse(BigDecimal.ZERO);
        String mensagem = vantagemOpt.map(v -> "Resgate de vantagem: " + v.getDescricao()).orElse("Resgate de vantagem");

        return new TransacaoResponse(
                resgate.getId(),
                aluno.getId(),
                aluno.getNome(),
                aluno.getId(),
                aluno.getNome(),
                valorDebitado.negate(),
                mensagem + " (codigo " + resgate.getCodigoUnico() + ")",
                resgate.getDataHora()
        );
    }
}
