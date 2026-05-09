package br.com.moedaestudantil.repository;

import br.com.moedaestudantil.model.Cupom;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;
import io.micronaut.data.annotation.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository: Cupom
 * 
 * ResponsÃƒÆ’Ã‚Â¡vel por:
 * - CRUD operaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes em Cupom
 * - Queries customizadas para buscar cupons
 * - RelatÃƒÆ’Ã‚Â³rios de cupons resgatados/nÃƒÆ’Ã‚Â£o resgatados
 */
@Repository
public interface CupomRepository extends JpaRepository<Cupom, Long> {
    
    /**
     * Busca cupom por cÃƒÆ’Ã‚Â³digo ÃƒÆ’Ã‚Âºnico
     * 
     * @param codigo CÃƒÆ’Ã‚Â³digo do cupom (ex: ABC-12345-XYZ)
     * @return Optional com cupom se encontrado
     */
    Optional<Cupom> findByCodigo(String codigo);
    
    /**
     * Busca todos cupons de um usuÃƒÆ’Ã‚Â¡rio
     * Ordenados por data de geraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o (mais recentes primeiro)
     * 
     * @param usuarioId ID do usuÃƒÆ’Ã‚Â¡rio
     * @return Lista de cupons do usuÃƒÆ’Ã‚Â¡rio
     */
    @Query("SELECT c FROM Cupom c WHERE c.usuario.id = :usuarioId ORDER BY c.dataGeracao DESC")
       List<Cupom> findByUsuarioIdOrdenado(Long usuarioId);
    
    /**
     * Busca cupons nÃƒÆ’Ã‚Â£o utilizados de um usuÃƒÆ’Ã‚Â¡rio
     * 
     * @param usuarioId ID do usuÃƒÆ’Ã‚Â¡rio
     * @return Lista de cupons pendentes
     */
    @Query("SELECT c FROM Cupom c WHERE c.usuario.id = :usuarioId AND c.utilizado = false " +
           "ORDER BY c.dataGeracao DESC")
    List<Cupom> findCuponsPendentes(Long usuarioId);
    
    /**
     * Busca cupons utilizados de um usuÃƒÆ’Ã‚Â¡rio
     * 
     * @param usuarioId ID do usuÃƒÆ’Ã‚Â¡rio
     * @return Lista de cupons jÃƒÆ’Ã‚Â¡ resgatados
     */
    @Query("SELECT c FROM Cupom c WHERE c.usuario.id = :usuarioId AND c.utilizado = true " +
           "ORDER BY c.dataResgate DESC")
    List<Cupom> findCupomsUtilizados(Long usuarioId);
    
    /**
     * Busca kupons de uma vantagem especÃƒÆ’Ã‚Â­fica
     * 
     * @param vantagemId ID da vantagem
     * @return Lista de cupons gerados para essa vantagem
     */
    @Query("SELECT c FROM Cupom c WHERE c.vantagem.id = :vantagemId ORDER BY c.dataGeracao DESC")
       List<Cupom> findByVantagemId(Long vantagemId);
    
    /**
     * Conta cupons de uma vantagem que foram utilizados
     * ÃƒÆ’Ã…Â¡til para relatÃƒÆ’Ã‚Â³rio: "Quantas pessoas jÃƒÆ’Ã‚Â¡ resgataram essa vantagem?"
     * 
     * @param vantagemId ID da vantagem
     * @return NÃƒÆ’Ã‚Âºmero de cupons utilizados
     */
    @Query("SELECT COUNT(c) FROM Cupom c WHERE c.vantagem.id = :vantagemId AND c.utilizado = true")
       Long contarResgatesVantagem(Long vantagemId);
    
    /**
     * Busca cupons gerados em um perÃƒÆ’Ã‚Â­odo especÃƒÆ’Ã‚Â­fico
     * ÃƒÆ’Ã…Â¡til para relatÃƒÆ’Ã‚Â³rios de atividade
     * 
     * @param dataInicio InÃƒÆ’Ã‚Â­cio do perÃƒÆ’Ã‚Â­odo
     * @param dataFim Fim do perÃƒÆ’Ã‚Â­odo
     * @return Lista de cupons gerados no perÃƒÆ’Ã‚Â­odo
     */
    @Query("SELECT c FROM Cupom c WHERE c.dataGeracao BETWEEN :dataInicio AND :dataFim " +
           "ORDER BY c.dataGeracao DESC")
   List<Cupom> findCuponsPeriodo(LocalDateTime dataInicio,
                          LocalDateTime dataFim);
    
    /**
     * Busca cupons expirados (gerados hÃƒÆ’Ã‚Â¡ mais de X dias sem serem usados)
     * ÃƒÆ’Ã…Â¡til para limpeza/auditoria
     * 
     * @param dataLimite Data limite para considerar como expirado
     * @return Lista de cupons expirados
     */
    @Query("SELECT c FROM Cupom c WHERE c.utilizado = false AND c.dataGeracao < :dataLimite")
      List<Cupom> findCupomsExpirados(LocalDateTime dataLimite);
    
    /**
     * EstatÃƒÆ’Ã‚Â­stica: Total de cupons gerados
     * 
     * @return NÃƒÆ’Ã‚Âºmero total de cupons no sistema
     */
    @Query("SELECT COUNT(c) FROM Cupom c")
    Long contarTotalCupons();
    
    /**
     * EstatÃƒÆ’Ã‚Â­stica: Total de cupons utilizados
     * 
     * @return NÃƒÆ’Ã‚Âºmero de cupons resgatados
     */
    @Query("SELECT COUNT(c) FROM Cupom c WHERE c.utilizado = true")
    Long contarCupomsUtilizados();
    
    /**
     * EstatÃƒÆ’Ã‚Â­stica: Taxa de utilizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o
     * Cupons utilizados / Total de cupons
     * 
     * @return Percentual de utilizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o (0-100)
     */
    @Query("SELECT (CAST(COUNT(CASE WHEN c.utilizado = true THEN 1 END) AS DOUBLE) / " +
           "CAST(COUNT(c) AS DOUBLE)) * 100 FROM Cupom c")
    Double getTaxaUtilizacao();
    
    /**
     * Verifica se cÃƒÆ’Ã‚Â³digo de cupom jÃƒÆ’Ã‚Â¡ existe
     * 
     * @param codigo CÃƒÆ’Ã‚Â³digo a verificar
     * @return true se existe, false caso contrÃƒÆ’Ã‚Â¡rio
     */
    boolean existsByCodigo(String codigo);
    
}





