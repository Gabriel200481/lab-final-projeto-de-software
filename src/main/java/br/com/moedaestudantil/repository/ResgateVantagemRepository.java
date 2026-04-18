package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.ResgateVantagem;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResgateVantagemRepository extends JpaRepository<ResgateVantagem, UUID> {

    boolean existsByCodigoUnico(String codigoUnico);
}
