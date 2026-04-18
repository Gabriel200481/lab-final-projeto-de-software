package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.ExtratoResumoResponse;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class ExtratoService {

    private final TransacaoMoedaRepository transacaoMoedaRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;

    public ExtratoService(
            TransacaoMoedaRepository transacaoMoedaRepository,
            AlunoRepository alunoRepository,
            ProfessorRepository professorRepository
    ) {
        this.transacaoMoedaRepository = transacaoMoedaRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
    }

        public List<TransacaoResponse> extratoAluno(UUID alunoId, LocalDate dataInicio, LocalDate dataFim) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));

                validarPeriodo(dataInicio, dataFim);

                List<TransacaoMoeda> transacoes;
                if (dataInicio != null) {
                        LocalDateTime inicio = dataInicio.atStartOfDay();
                        LocalDateTime fim = dataFim.plusDays(1).atStartOfDay().minusNanos(1);
                        transacoes = transacaoMoedaRepository.findByDestinatarioIdAndDataHoraBetweenOrderByDataHoraDesc(
                                        aluno.getId(),
                                        inicio,
                                        fim
                        );
                } else {
                        transacoes = transacaoMoedaRepository.findByDestinatarioIdOrderByDataHoraDesc(aluno.getId());
                }

                return transacoes.stream()
                .map(this::toResponse)
                .toList();
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
}
