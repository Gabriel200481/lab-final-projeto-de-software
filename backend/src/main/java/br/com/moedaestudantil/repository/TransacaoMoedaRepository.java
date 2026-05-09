package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.TransacaoMoeda;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface TransacaoMoedaRepository extends JpaRepository<TransacaoMoeda, UUID> {

	List<TransacaoMoeda> findByDestinatarioIdOrderByDataHoraDesc(UUID destinatarioId);

	List<TransacaoMoeda> findByDestinatarioIdAndDataHoraBetweenOrderByDataHoraDesc(
			UUID destinatarioId,
			LocalDateTime dataInicio,
			LocalDateTime dataFim
	);

	List<TransacaoMoeda> findByRemetenteIdOrderByDataHoraDesc(UUID remetenteId);

	List<TransacaoMoeda> findByRemetenteIdAndDataHoraBetweenOrderByDataHoraDesc(
			UUID remetenteId,
			LocalDateTime dataInicio,
			LocalDateTime dataFim
	);
}





