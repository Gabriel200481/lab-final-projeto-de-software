package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.EmpresaParceira;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, UUID> {

	boolean existsByEmail(String email);

	Optional<EmpresaParceira> findByEmail(String email);
}
