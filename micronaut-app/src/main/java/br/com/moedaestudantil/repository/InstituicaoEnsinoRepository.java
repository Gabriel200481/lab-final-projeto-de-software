package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.InstituicaoEnsino;
import java.util.Optional;
import java.util.UUID;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface InstituicaoEnsinoRepository extends JpaRepository<InstituicaoEnsino, UUID> {

    Optional<InstituicaoEnsino> findBySigla(String sigla);
}





