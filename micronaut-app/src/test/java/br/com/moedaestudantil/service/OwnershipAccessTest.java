package br.com.moedaestudantil.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import br.com.moedaestudantil.dto.AlunoRequest;
import br.com.moedaestudantil.dto.EmpresaRequest;
import br.com.moedaestudantil.dto.ProfessorRequest;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.EmpresaParceira;
import br.com.moedaestudantil.model.InstituicaoEnsino;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.EmpresaParceiraRepository;
import br.com.moedaestudantil.repository.InstituicaoEnsinoRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.security.CurrentUserService;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import io.micronaut.security.utils.SecurityService;

class OwnershipAccessTest {

    private static final UUID INSTITUICAO_ID = UUID.randomUUID();

    private AlunoRepository alunoRepository;
    private ProfessorRepository professorRepository;
    private EmpresaParceiraRepository empresaParceiraRepository;
    private InstituicaoEnsinoRepository instituicaoEnsinoRepository;
    private PasswordEncoder passwordEncoder;
    private CurrentUserService currentUserService;

    @BeforeEach
    void setup() {
        alunoRepository = mock(AlunoRepository.class);
        professorRepository = mock(ProfessorRepository.class);
        empresaParceiraRepository = mock(EmpresaParceiraRepository.class);
        instituicaoEnsinoRepository = mock(InstituicaoEnsinoRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);

        SecurityService securityService = mock(SecurityService.class);
        when(securityService.username()).thenReturn(Optional.of("auth@lab03.com"));

        currentUserService = new CurrentUserService(securityService, alunoRepository, professorRepository, empresaParceiraRepository);

        InstituicaoEnsino instituicao = new InstituicaoEnsino();
        instituicao.setId(INSTITUICAO_ID);
        instituicao.setNome("Instituicao");
        instituicao.setSigla("INST");
        when(instituicaoEnsinoRepository.findById(INSTITUICAO_ID)).thenReturn(Optional.of(instituicao));
        when(passwordEncoder.encode("senha")).thenReturn("hash");
    }

    @Test
    void alunoNaoPodeAcessarOutroAluno() {
        UUID alunoAutenticadoId = UUID.randomUUID();
        UUID outroAlunoId = UUID.randomUUID();

        Aluno alunoAutenticado = aluno(alunoAutenticadoId, "Aluno Autenticado", "auth@lab03.com");
        when(alunoRepository.findByEmail("auth@lab03.com")).thenReturn(Optional.of(alunoAutenticado));

        AlunoService service = new AlunoService(alunoRepository, instituicaoEnsinoRepository, passwordEncoder, currentUserService);

        assertThrows(BusinessException.class, () -> service.buscarPorId(outroAlunoId));
        assertThrows(BusinessException.class, () -> service.atualizar(outroAlunoId, alunoRequest()));
        assertThrows(BusinessException.class, () -> service.excluir(outroAlunoId));
    }

    @Test
    void professorNaoPodeAcessarOutroProfessor() {
        UUID professorAutenticadoId = UUID.randomUUID();
        UUID outroProfessorId = UUID.randomUUID();

        Professor professorAutenticado = professor(professorAutenticadoId, "Professor Autenticado", "auth@lab03.com");
        when(professorRepository.findByEmail("auth@lab03.com")).thenReturn(Optional.of(professorAutenticado));

        ProfessorService service = new ProfessorService(professorRepository, instituicaoEnsinoRepository, passwordEncoder, currentUserService);

        assertThrows(BusinessException.class, () -> service.buscarPorId(outroProfessorId));
        assertThrows(BusinessException.class, () -> service.atualizar(outroProfessorId, professorRequest()));
        assertThrows(BusinessException.class, () -> service.excluir(outroProfessorId));
    }

    @Test
    void empresaNaoPodeAcessarOutraEmpresa() {
        UUID empresaAutenticadaId = UUID.randomUUID();
        UUID outraEmpresaId = UUID.randomUUID();

        EmpresaParceira empresaAutenticada = empresa(empresaAutenticadaId, "Empresa Autenticada", "auth@lab03.com");
        when(empresaParceiraRepository.findByEmail("auth@lab03.com")).thenReturn(Optional.of(empresaAutenticada));

        EmpresaService service = new EmpresaService(empresaParceiraRepository, mock(br.com.moedaestudantil.repository.VantagemRepository.class), passwordEncoder, currentUserService);

        assertThrows(BusinessException.class, () -> service.atualizar(outraEmpresaId, empresaRequest()));
        assertThrows(BusinessException.class, () -> service.excluir(outraEmpresaId));
        assertThrows(BusinessException.class, () -> service.adicionarVantagem(outraEmpresaId, new br.com.moedaestudantil.dto.VantagemRequest("Desc", "https://img", java.math.BigDecimal.TEN)));
    }

    private Aluno aluno(UUID id, String nome, String email) {
        Aluno aluno = new Aluno();
        aluno.setId(id);
        aluno.setNome(nome);
        aluno.setEmail(email);
        aluno.setCpf("12345678901");
        aluno.setRg("MG1234567");
        aluno.setEndereco("Rua X");
        aluno.setCurso("Curso");
        aluno.setSaldoAtual(java.math.BigDecimal.ZERO);
        aluno.setInstituicao(instituicao());
        return aluno;
    }

    private Professor professor(UUID id, String nome, String email) {
        Professor professor = new Professor();
        professor.setId(id);
        professor.setNome(nome);
        professor.setEmail(email);
        professor.setCpf("10987654321");
        professor.setDepartamento("Depto");
        professor.setSaldoAtual(java.math.BigDecimal.valueOf(1000));
        professor.setInstituicao(instituicao());
        return professor;
    }

    private EmpresaParceira empresa(UUID id, String nome, String email) {
        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setId(id);
        empresa.setNome(nome);
        empresa.setEmail(email);
        empresa.setNomeFantasia("Fantasia");
        return empresa;
    }

    private InstituicaoEnsino instituicao() {
        InstituicaoEnsino instituicao = new InstituicaoEnsino();
        instituicao.setId(INSTITUICAO_ID);
        instituicao.setNome("Instituicao");
        instituicao.setSigla("INST");
        return instituicao;
    }

    private AlunoRequest alunoRequest() {
        return new AlunoRequest("Aluno", "aluno@lab03.com", "senha", "12345678901", "MG1234567", "Rua Y", "Curso", INSTITUICAO_ID);
    }

    private ProfessorRequest professorRequest() {
        return new ProfessorRequest("Professor", "professor@lab03.com", "senha", "10987654321", "Depto", INSTITUICAO_ID);
    }

    private EmpresaRequest empresaRequest() {
        return new EmpresaRequest("Empresa", "empresa@lab03.com", "senha", "Fantasia");
    }
}