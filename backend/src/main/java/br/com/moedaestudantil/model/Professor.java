package br.com.moedaestudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;

@Entity
public class Professor extends Usuario {

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String departamento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "instituicao_id", nullable = false)
    private InstituicaoEnsino instituicao;

    @Column(nullable = false)
    private BigDecimal saldoAtual = BigDecimal.ZERO;

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public InstituicaoEnsino getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(InstituicaoEnsino instituicao) {
        this.instituicao = instituicao;
    }

    public BigDecimal getSaldoAtual() {
        return saldoAtual;
    }

    public void setSaldoAtual(BigDecimal saldoAtual) {
        this.saldoAtual = saldoAtual;
    }
}



