package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.ResgateVantagem;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface ResgateVantagemRepository extends JpaRepository<ResgateVantagem, UUID> {

    boolean existsByCodigoUnico(String codigoUnico);

    List<ResgateVantagem> findByAlunoIdOrderByDataHoraDesc(UUID alunoId);

    List<ResgateVantagem> findByAlunoIdAndDataHoraBetweenOrderByDataHoraDesc(
            UUID alunoId,
            LocalDateTime dataInicio,
            LocalDateTime dataFim
    );
}





