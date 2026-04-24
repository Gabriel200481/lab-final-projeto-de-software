package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.AuthRequest;
import br.com.moedaestudantil.dto.AuthResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Usuario;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.EmpresaParceiraRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import br.com.moedaestudantil.security.JwtService;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.inject.Singleton;

@Singleton
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AlunoRepository alunoRepository,
            ProfessorRepository professorRepository,
            EmpresaParceiraRepository empresaParceiraRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.empresaParceiraRepository = empresaParceiraRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(AuthRequest request) {
        Optional<? extends Usuario> usuario = alunoRepository.findByEmail(request.email())
                .map(u -> (Usuario) u)
                .or(() -> professorRepository.findByEmail(request.email()).map(u -> (Usuario) u))
                .or(() -> empresaParceiraRepository.findByEmail(request.email()).map(u -> (Usuario) u));

        Usuario encontrado = usuario.orElseThrow(() -> new BusinessException("Credenciais invalidas"));
        if (!passwordEncoder.matches(request.senha(), encontrado.getSenhaHash())) {
            throw new BusinessException("Credenciais invalidas");
        }

        String token = jwtService.generateToken(encontrado);

        return new AuthResponse(
                encontrado.getId(),
                encontrado.getNome(),
                encontrado.getEmail(),
            encontrado.getPapel(),
            token
        );
    }
}



