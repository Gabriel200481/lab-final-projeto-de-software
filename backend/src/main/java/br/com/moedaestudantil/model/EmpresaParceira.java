package br.com.moedaestudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class EmpresaParceira extends Usuario {

    @Column(nullable = false)
    private String nomeFantasia;

    @OneToMany(mappedBy = "empresa", orphanRemoval = true)
    private List<Vantagem> vantagens = new ArrayList<>();

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public List<Vantagem> getVantagens() {
        return vantagens;
    }

    public void setVantagens(List<Vantagem> vantagens) {
        this.vantagens = vantagens;
    }
}



