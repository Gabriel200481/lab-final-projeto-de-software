package br.com.moedaestudantil.security;

import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.EmpresaParceira;
import br.com.moedaestudantil.model.Professor;
import br.com.moedaestudantil.repository.AlunoRepository;
import br.com.moedaestudantil.repository.EmpresaParceiraRepository;
import br.com.moedaestudantil.repository.ProfessorRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;

    public CurrentUserService(
            AlunoRepository alunoRepository,
            ProfessorRepository professorRepository,
            EmpresaParceiraRepository empresaParceiraRepository
    ) {
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

    public String getAuthenticatedEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new BusinessException("Usuario nao autenticado");
        }
        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new BusinessException("Email do usuario autenticado nao encontrado");
        }
        return email;
    }
}