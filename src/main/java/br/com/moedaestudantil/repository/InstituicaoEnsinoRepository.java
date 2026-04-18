package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.InstituicaoEnsino;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstituicaoEnsinoRepository extends JpaRepository<InstituicaoEnsino, UUID> {

    Optional<InstituicaoEnsino> findBySigla(String sigla);
}
