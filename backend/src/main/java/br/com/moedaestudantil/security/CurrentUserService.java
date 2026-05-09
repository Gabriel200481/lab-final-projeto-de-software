package br.com.moedaestudantil.security;

import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.EmpresaParceira;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.EmpresaParceiraRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import io.micronaut.security.utils.SecurityService;
import jakarta.inject.Singleton;

@Singleton
public class CurrentUserService {

    private final SecurityService securityService;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;

    public CurrentUserService(
            SecurityService securityService,
            AlunoRepository alunoRepository,
            ProfessorRepository professorRepository,
            EmpresaParceiraRepository empresaParceiraRepository
    ) {
        this.securityService = securityService;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.empresaParceiraRepository = empresaParceiraRepository;
    }

    public Aluno getAuthenticatedAluno() {
        String email = getAuthenticatedEmail();
        return alunoRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario autenticado nao pertence a um aluno"));
    }

    public Professor getAuthenticatedProfessor() {
        String email = getAuthenticatedEmail();
        return professorRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario autenticado nao pertence a um professor"));
    }

    public EmpresaParceira getAuthenticatedEmpresa() {
        String email = getAuthenticatedEmail();
        return empresaParceiraRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario autenticado nao pertence a uma empresa"));
    }

    private String getAuthenticatedEmail() {
        String email = securityService.username()
                .orElseThrow(() -> new BusinessException("Usuario nao autenticado"));
        if (email.isBlank()) {
            throw new BusinessException("Email do usuario autenticado nao encontrado");
        }
        return email;
    }
}