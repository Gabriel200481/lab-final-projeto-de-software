package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.Vantagem;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface VantagemRepository extends JpaRepository<Vantagem, UUID> {

    List<Vantagem> findByEmpresaId(UUID empresaId);

    Optional<Vantagem> findByIdAndAtivaTrue(UUID id);
}





