package br.com.moedaestudantil.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import br.com.moedaestudantil.dto.AuthRequest;
import br.com.moedaestudantil.dto.AuthResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.PapelUsuario;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.EmpresaParceiraRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.security.JwtService;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {

    private AlunoRepository alunoRepository;
    private ProfessorRepository professorRepository;
    private EmpresaParceiraRepository empresaParceiraRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setup() {
        alunoRepository = mock(AlunoRepository.class);
        professorRepository = mock(ProfessorRepository.class);
        empresaParceiraRepository = mock(EmpresaParceiraRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);

        authService = new AuthService(
                alunoRepository,
                professorRepository,
                empresaParceiraRepository,
                passwordEncoder,
                jwtService
        );
    }

    @Test
    void deveAutenticarUsuarioQuandoCredenciaisSaoValidas() {
        Aluno aluno = new Aluno();
        UUID id = UUID.randomUUID();
        aluno.setId(id);
        aluno.setNome("Aluno Teste");
        aluno.setEmail("aluno@lab03.com");
        aluno.setSenhaHash("hash-salvo");
        aluno.setPapel(PapelUsuario.ALUNO);

        when(alunoRepository.findByEmail("aluno@lab03.com")).thenReturn(Optional.of(aluno));
        when(professorRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(empresaParceiraRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.matches("senha-plana", "hash-salvo")).thenReturn(true);
        when(jwtService.generateToken(aluno)).thenReturn("token-gerado");

        AuthResponse response = authService.login(new AuthRequest("aluno@lab03.com", "senha-plana"));

        assertEquals(id, response.id());
        assertEquals("Aluno Teste", response.nome());
        assertEquals("aluno@lab03.com", response.email());
        assertEquals(PapelUsuario.ALUNO, response.papel());
        assertEquals("token-gerado", response.token());
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoExiste() {
        when(alunoRepository.findByEmail("inexistente@lab03.com")).thenReturn(Optional.empty());
        when(professorRepository.findByEmail("inexistente@lab03.com")).thenReturn(Optional.empty());
        when(empresaParceiraRepository.findByEmail("inexistente@lab03.com")).thenReturn(Optional.empty());

        assertThrows(
                BusinessException.class,
                () -> authService.login(new AuthRequest("inexistente@lab03.com", "senha"))
        );
    }

    @Test
    void deveLancarExcecaoQuandoSenhaNaoConfere() {
        Aluno aluno = new Aluno();
        aluno.setEmail("aluno@lab03.com");
        aluno.setSenhaHash("hash-salvo");

        when(alunoRepository.findByEmail("aluno@lab03.com")).thenReturn(Optional.of(aluno));
        when(passwordEncoder.matches("senha-errada", "hash-salvo")).thenReturn(false);

        assertThrows(
                BusinessException.class,
                () -> authService.login(new AuthRequest("aluno@lab03.com", "senha-errada"))
        );
    }
}
