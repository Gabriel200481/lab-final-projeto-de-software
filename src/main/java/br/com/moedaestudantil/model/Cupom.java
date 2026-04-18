package br.com.moedaestudantil.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity: Cupom de Resgate
 * 
 * Representa um cupom gerado quando um aluno resgata uma vantagem.
 * Inclui:
 * - Código único (ABC-XXXXX-XYZ)
 * - QR Code para validação/rastreamento
 * - Relacionamento com Vantagem e Usuario
 * - Status (utilizado/não utilizado)
 * - Datas de criação e resgate
 */
@Entity
@Table(name = "CUPOM", indexes = {
    @Index(name = "idx_cupom_codigo", columnList = "CODIGO", unique = true),
    @Index(name = "idx_cupom_usuario", columnList = "USUARIO_ID"),
    @Index(name = "idx_cupom_vantagem", columnList = "VANTAGEM_ID"),
    @Index(name = "idx_cupom_utilizado", columnList = "UTILIZADO")
})
public class Cupom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Código único do cupom
     * Formato: ABC-XXXXX-XYZ
     * Exemplo: ABC-12345-DEF
     * 
     * Constraint: UNIQUE (garantido pelo banco)
     */
    @Column(name = "CODIGO", unique = true, nullable = false, length = 50)
    private String codigo;
    
    /**
     * Relacionamento ManyToOne com Usuario
     * O aluno que resgatou a vantagem
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USUARIO_ID", nullable = false)
    private Usuario usuario;
    
    /**
     * Relacionamento ManyToOne com Vantagem
     * A vantagem que foi resgatada
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VANTAGEM_ID", nullable = false)
    private Vantagem vantagem;
    
    /**
     * URL pública do QR Code gerado
     * Tipo: HTTPS para produção
     * Exemplo: https://moeda-estudantil-backend.onrender.com/qrcodes/cupom_123_456_1713450000000_abc12def.png
     */
    @Column(name = "QRCODE_URL", columnDefinition = "TEXT")
    private String qrcodeUrl;
    
    /**
     * Data/hora em que o cupom foi gerado
     * Preenchida automaticamente por @CreationTimestamp
     */
    @CreationTimestamp
    @Column(name = "DATA_GERACAO", nullable = false, updatable = false)
    private LocalDateTime dataGeracao;
    
    /**
     * Data/hora em que o cupom foi resgatado/utilizado
     * Null enquanto não utilizado
     * Preenchida quando utilizado=true
     */
    @Column(name = "DATA_RESGATE")
    private LocalDateTime dataResgate;
    
    /**
     * Flag: Este cupom já foi utilizado?
     * false = Pendente de uso
     * true = Já foi resgatado
     */
    @Column(name = "UTILIZADO", nullable = false)
    private Boolean utilizado = false;
    
    /**
     * Data/hora da última atualização do registro
     * Preenchida automaticamente
     */
    @UpdateTimestamp
    @Column(name = "DATA_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;
    
    /**
     * Observações/comentários do resgate
     * Exemplo: "Resgatado em presença"
     */
    @Column(name = "OBSERVACOES", columnDefinition = "TEXT")
    private String observacoes;
    
    // ============ CONSTRUTORES ============
    
    public Cupom() {
    }
    
    public Cupom(String codigo, Usuario usuario, Vantagem vantagem, String qrcodeUrl) {
        this.codigo = codigo;
        this.usuario = usuario;
        this.vantagem = vantagem;
        this.qrcodeUrl = qrcodeUrl;
        this.utilizado = false;
    }
    
    // ============ GETTERS / SETTERS ============
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Vantagem getVantagem() {
        return vantagem;
    }
    
    public void setVantagem(Vantagem vantagem) {
        this.vantagem = vantagem;
    }
    
    public String getQrcodeUrl() {
        return qrcodeUrl;
    }
    
    public void setQrcodeUrl(String qrcodeUrl) {
        this.qrcodeUrl = qrcodeUrl;
    }
    
    public LocalDateTime getDataGeracao() {
        return dataGeracao;
    }
    
    public void setDataGeracao(LocalDateTime dataGeracao) {
        this.dataGeracao = dataGeracao;
    }
    
    public LocalDateTime getDataResgate() {
        return dataResgate;
    }
    
    public void setDataResgate(LocalDateTime dataResgate) {
        this.dataResgate = dataResgate;
    }
    
    public Boolean getUtilizado() {
        return utilizado;
    }
    
    public void setUtilizado(Boolean utilizado) {
        this.utilizado = utilizado;
    }
    
    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }
    
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    // ============ MÉTODOS DE NEGÓCIO ============
    
    /**
     * Marca cupom como utilizado
     * Define data de resgate
     */
    public void marcarComoUtilizado() {
        this.utilizado = true;
        this.dataResgate = LocalDateTime.now();
    }
    
    /**
     * Verifica se cupom expirou (mais de X dias sem usar)
     * 
     * @param diasValidade Número de dias para expiração
     * @return true se expirou
     */
    public boolean expirou(int diasValidade) {
        if (utilizado) return false; // Já utilizado, não expira
        
        LocalDateTime dataExpiracao = dataGeracao.plusDays(diasValidade);
        return LocalDateTime.now().isAfter(dataExpiracao);
    }
    
    @Override
    public String toString() {
        return "Cupom{" +
                "id=" + id +
                ", codigo='" + codigo + '\'' +
                ", usuario=" + (usuario != null ? usuario.getId() : null) +
                ", vantagem=" + (vantagem != null ? vantagem.getId() : null) +
                ", utilizado=" + utilizado +
                ", dataGeracao=" + dataGeracao +
                ", dataResgate=" + dataResgate +
                '}';
    }
    
}
