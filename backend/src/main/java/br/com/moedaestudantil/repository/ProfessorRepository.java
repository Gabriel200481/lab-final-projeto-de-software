package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.Professor;
import java.util.Optional;
import java.util.UUID;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

	Optional<Professor> findByEmail(String email);

	boolean existsByCpf(String cpf);

	boolean existsByEmail(String email);
}





