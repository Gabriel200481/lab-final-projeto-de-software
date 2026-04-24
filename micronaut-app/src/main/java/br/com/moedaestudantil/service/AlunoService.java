package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.AlunoRequest;
import br.com.moedaestudantil.dto.AlunoResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.InstituicaoEnsino;
import br.com.moedaestudantil.model.PapelUsuario;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.InstituicaoEnsinoRepository;
import br.com.moedaestudantil.security.CurrentUserService;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.inject.Singleton;

@Singleton
@SuppressWarnings("null")
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    public AlunoService(
            AlunoRepository alunoRepository,
            InstituicaoEnsinoRepository instituicaoEnsinoRepository,
            PasswordEncoder passwordEncoder,
            CurrentUserService currentUserService
    ) {
        this.alunoRepository = alunoRepository;
        this.instituicaoEnsinoRepository = instituicaoEnsinoRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentUserService = currentUserService;
    }

    public AlunoResponse criar(AlunoRequest request) {
        validarDuplicidade(request.cpf(), request.email(), null);
        InstituicaoEnsino instituicao = buscarInstituicao(request.instituicaoId());

        Aluno aluno = new Aluno();
        preencherAluno(aluno, request, instituicao);
        aluno.setPapel(PapelUsuario.ALUNO);
        Aluno salvo = Objects.requireNonNull(alunoRepository.save(aluno));
        return paraResponse(salvo);
    }

    public List<AlunoResponse> listar() {
        return alunoRepository.findAll().stream().map(this::paraResponse).toList();
    }

    public AlunoResponse buscarPorId(UUID id) {
        UUID safeId = Objects.requireNonNull(id);
        validarAcessoAoAluno(safeId);
        Aluno aluno = alunoRepository.findById(safeId)
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));
        return paraResponse(aluno);
    }

    public AlunoResponse atualizar(UUID id, AlunoRequest request) {
        UUID safeId = Objects.requireNonNull(id);
        validarAcessoAoAluno(safeId);
        Aluno aluno = alunoRepository.findById(safeId)
                .orElseThrow(() -> new NotFoundException("Aluno nao encontrado"));

        validarDuplicidade(request.cpf(), request.email(), safeId);
        InstituicaoEnsino instituicao = buscarInstituicao(request.instituicaoId());
        preencherAluno(aluno, request, instituicao);
        Aluno salvo = Objects.requireNonNull(alunoRepository.save(aluno));
        return paraResponse(salvo);
    }

    public void excluir(UUID id) {
        UUID safeId = Objects.requireNonNull(id);
        validarAcessoAoAluno(safeId);
        if (!alunoRepository.existsById(safeId)) {
            throw new NotFoundException("Aluno nao encontrado");
        }
        alunoRepository.deleteById(safeId);
    }

    private void validarAcessoAoAluno(UUID alunoId) {
        Aluno alunoAutenticado = currentUserService.getAuthenticatedAluno();
        if (!alunoAutenticado.getId().equals(alunoId)) {
            throw new BusinessException("Aluno autenticado nao pode acessar outro aluno");
        }
    }

    private InstituicaoEnsino buscarInstituicao(UUID instituicaoId) {
        UUID safeInstituicaoId = Objects.requireNonNull(instituicaoId);
        return instituicaoEnsinoRepository.findById(safeInstituicaoId)
                .orElseThrow(() -> new NotFoundException("Instituicao nao encontrada"));
    }

    private void validarDuplicidade(String cpf, String email, UUID idAtual) {
        boolean cpfDuplicado = alunoRepository.findAll().stream()
                .anyMatch(a -> a.getCpf().equals(cpf) && (idAtual == null || !a.getId().equals(idAtual)));
        if (cpfDuplicado) {
            throw new BusinessException("CPF ja cadastrado");
        }

        boolean emailDuplicado = alunoRepository.findAll().stream()
                .anyMatch(a -> a.getEmail().equalsIgnoreCase(email) && (idAtual == null || !a.getId().equals(idAtual)));
        if (emailDuplicado) {
            throw new BusinessException("Email ja cadastrado");
        }
    }

    private void preencherAluno(Aluno aluno, AlunoRequest request, InstituicaoEnsino instituicao) {
        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setSenhaHash(passwordEncoder.encode(request.senha()));
        aluno.setCpf(request.cpf());
        aluno.setRg(request.rg());
        aluno.setEndereco(request.endereco());
        aluno.setCurso(request.curso());
        aluno.setInstituicao(instituicao);
        aluno.setAtivo(true);
    }

    private AlunoResponse paraResponse(Aluno aluno) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getCpf(),
                aluno.getRg(),
                aluno.getEndereco(),
                aluno.getCurso(),
                aluno.getInstituicao().getId(),
                aluno.getInstituicao().getNome(),
                aluno.getInstituicao().getSigla()
        );
    }
}



