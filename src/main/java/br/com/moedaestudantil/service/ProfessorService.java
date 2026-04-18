package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.ProfessorRequest;
import br.com.moedaestudantil.dto.ProfessorResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.InstituicaoEnsino;
import br.com.moedaestudantil.model.PapelUsuario;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.repository.InstituicaoEnsinoRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class ProfessorService {

    private static final BigDecimal SALDO_INICIAL = BigDecimal.valueOf(1000);

    private final ProfessorRepository professorRepository;
    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfessorService(
            ProfessorRepository professorRepository,
            InstituicaoEnsinoRepository instituicaoEnsinoRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.professorRepository = professorRepository;
        this.instituicaoEnsinoRepository = instituicaoEnsinoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ProfessorResponse criar(ProfessorRequest request) {
        validarDuplicidade(request.cpf(), request.email(), null);
        InstituicaoEnsino instituicao = buscarInstituicao(request.instituicaoId());

        Professor professor = new Professor();
        preencherProfessor(professor, request, instituicao);
        professor.setPapel(PapelUsuario.PROFESSOR);
        professor.setSaldoAtual(SALDO_INICIAL);
        Professor salvo = Objects.requireNonNull(professorRepository.save(professor));
        return paraResponse(salvo);
    }

    public List<ProfessorResponse> listar() {
        return professorRepository.findAll().stream().map(this::paraResponse).toList();
    }

    public ProfessorResponse buscarPorId(UUID id) {
        Professor professor = professorRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new NotFoundException("Professor nao encontrado"));
        return paraResponse(professor);
    }

    public ProfessorResponse atualizar(UUID id, ProfessorRequest request) {
        UUID safeId = Objects.requireNonNull(id);
        Professor professor = professorRepository.findById(safeId)
                .orElseThrow(() -> new NotFoundException("Professor nao encontrado"));

        validarDuplicidade(request.cpf(), request.email(), safeId);
        InstituicaoEnsino instituicao = buscarInstituicao(request.instituicaoId());
        BigDecimal saldoAtual = professor.getSaldoAtual();
        preencherProfessor(professor, request, instituicao);
        professor.setSaldoAtual(saldoAtual);

        Professor salvo = Objects.requireNonNull(professorRepository.save(professor));
        return paraResponse(salvo);
    }

    public void excluir(UUID id) {
        UUID safeId = Objects.requireNonNull(id);
        if (!professorRepository.existsById(safeId)) {
            throw new NotFoundException("Professor nao encontrado");
        }
        professorRepository.deleteById(safeId);
    }

    private InstituicaoEnsino buscarInstituicao(UUID instituicaoId) {
        return instituicaoEnsinoRepository.findById(Objects.requireNonNull(instituicaoId))
                .orElseThrow(() -> new NotFoundException("Instituicao nao encontrada"));
    }

    private void validarDuplicidade(String cpf, String email, UUID idAtual) {
        boolean cpfDuplicado = professorRepository.findAll().stream()
                .anyMatch(p -> p.getCpf().equals(cpf) && (idAtual == null || !p.getId().equals(idAtual)));
        if (cpfDuplicado) {
            throw new BusinessException("CPF de professor ja cadastrado");
        }

        boolean emailDuplicado = professorRepository.findAll().stream()
                .anyMatch(p -> p.getEmail().equalsIgnoreCase(email) && (idAtual == null || !p.getId().equals(idAtual)));
        if (emailDuplicado) {
            throw new BusinessException("Email de professor ja cadastrado");
        }
    }

    private void preencherProfessor(Professor professor, ProfessorRequest request, InstituicaoEnsino instituicao) {
        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setSenhaHash(passwordEncoder.encode(request.senha()));
        professor.setCpf(request.cpf());
        professor.setDepartamento(request.departamento());
        professor.setInstituicao(instituicao);
        professor.setAtivo(true);
    }

    private ProfessorResponse paraResponse(Professor professor) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                professor.getCpf(),
                professor.getDepartamento(),
                professor.getInstituicao().getId(),
                professor.getInstituicao().getNome(),
                professor.getInstituicao().getSigla(),
                professor.getSaldoAtual()
        );
    }
}
