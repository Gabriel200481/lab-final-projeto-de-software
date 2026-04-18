package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository: Cupom
 * 
 * Responsável por:
 * - CRUD operações em Cupom
 * - Queries customizadas para buscar cupons
 * - Relatórios de cupons resgatados/não resgatados
 */
@Repository
public interface CupomRepository extends JpaRepository<Cupom, Long> {
    
    /**
     * Busca cupom por código único
     * 
     * @param codigo Código do cupom (ex: ABC-12345-XYZ)
     * @return Optional com cupom se encontrado
     */
    Optional<Cupom> findByCodigo(String codigo);
    
    /**
     * Busca todos cupons de um usuário
     * Ordenados por data de geração (mais recentes primeiro)
     * 
     * @param usuarioId ID do usuário
     * @return Lista de cupons do usuário
     */
    @Query("SELECT c FROM Cupom c WHERE c.usuario.id = :usuarioId ORDER BY c.dataGeracao DESC")
    List<Cupom> findByUsuarioIdOrdenado(@Param("usuarioId") Long usuarioId);
    
    /**
     * Busca cupons não utilizados de um usuário
     * 
     * @param usuarioId ID do usuário
     * @return Lista de cupons pendentes
     */
    @Query("SELECT c FROM Cupom c WHERE c.usuario.id = :usuarioId AND c.utilizado = false " +
           "ORDER BY c.dataGeracao DESC")
    List<Cupom> findCuponsPendentes(@Param("usuarioId") Long usuarioId);
    
    /**
     * Busca cupons utilizados de um usuário
     * 
     * @param usuarioId ID do usuário
     * @return Lista de cupons já resgatados
     */
    @Query("SELECT c FROM Cupom c WHERE c.usuario.id = :usuarioId AND c.utilizado = true " +
           "ORDER BY c.dataResgate DESC")
    List<Cupom> findCupomsUtilizados(@Param("usuarioId") Long usuarioId);
    
    /**
     * Busca kupons de uma vantagem específica
     * 
     * @param vantagemId ID da vantagem
     * @return Lista de cupons gerados para essa vantagem
     */
    @Query("SELECT c FROM Cupom c WHERE c.vantagem.id = :vantagemId ORDER BY c.dataGeracao DESC")
    List<Cupom> findByVantagemId(@Param("vantagemId") Long vantagemId);
    
    /**
     * Conta cupons de uma vantagem que foram utilizados
     * Útil para relatório: "Quantas pessoas já resgataram essa vantagem?"
     * 
     * @param vantagemId ID da vantagem
     * @return Número de cupons utilizados
     */
    @Query("SELECT COUNT(c) FROM Cupom c WHERE c.vantagem.id = :vantagemId AND c.utilizado = true")
    Long contarResgatesVantagem(@Param("vantagemId") Long vantagemId);
    
    /**
     * Busca cupons gerados em um período específico
     * Útil para relatórios de atividade
     * 
     * @param dataInicio Início do período
     * @param dataFim Fim do período
     * @return Lista de cupons gerados no período
     */
    @Query("SELECT c FROM Cupom c WHERE c.dataGeracao BETWEEN :dataInicio AND :dataFim " +
           "ORDER BY c.dataGeracao DESC")
    List<Cupom> findCuponsPeríodo(@Param("dataInicio") LocalDateTime dataInicio,
                                   @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Busca cupons expirados (gerados há mais de X dias sem serem usados)
     * Útil para limpeza/auditoria
     * 
     * @param dataLimite Data limite para considerar como expirado
     * @return Lista de cupons expirados
     */
    @Query("SELECT c FROM Cupom c WHERE c.utilizado = false AND c.dataGeracao < :dataLimite")
    List<Cupom> findCupomsExpirados(@Param("dataLimite") LocalDateTime dataLimite);
    
    /**
     * Estatística: Total de cupons gerados
     * 
     * @return Número total de cupons no sistema
     */
    @Query("SELECT COUNT(c) FROM Cupom c")
    Long contarTotalCupons();
    
    /**
     * Estatística: Total de cupons utilizados
     * 
     * @return Número de cupons resgatados
     */
    @Query("SELECT COUNT(c) FROM Cupom c WHERE c.utilizado = true")
    Long contarCupomsUtilizados();
    
    /**
     * Estatística: Taxa de utilização
     * Cupons utilizados / Total de cupons
     * 
     * @return Percentual de utilização (0-100)
     */
    @Query("SELECT (CAST(COUNT(CASE WHEN c.utilizado = true THEN 1 END) AS DOUBLE) / " +
           "CAST(COUNT(c) AS DOUBLE)) * 100 FROM Cupom c")
    Double getTaxaUtilizacao();
    
    /**
     * Verifica se código de cupom já existe
     * 
     * @param codigo Código a verificar
     * @return true se existe, false caso contrário
     */
    boolean existsByCodigo(String codigo);
    
}
