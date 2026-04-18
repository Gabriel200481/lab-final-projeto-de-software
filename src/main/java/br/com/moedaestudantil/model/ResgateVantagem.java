package br.com.moedaestudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class ResgateVantagem {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID alunoId;

    @Column(nullable = false)
    private UUID vantagemId;

    @Column(nullable = false, unique = true)
    private String codigoUnico;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(UUID alunoId) {
        this.alunoId = alunoId;
    }

    public UUID getVantagemId() {
        return vantagemId;
    }

    public void setVantagemId(UUID vantagemId) {
        this.vantagemId = vantagemId;
    }

    public String getCodigoUnico() {
        return codigoUnico;
    }

    public void setCodigoUnico(String codigoUnico) {
        this.codigoUnico = codigoUnico;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}
