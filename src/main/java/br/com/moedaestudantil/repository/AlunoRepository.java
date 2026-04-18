package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.Aluno;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, UUID> {

	boolean existsByCpf(String cpf);

	boolean existsByEmail(String email);

	Optional<Aluno> findByEmail(String email);
}
