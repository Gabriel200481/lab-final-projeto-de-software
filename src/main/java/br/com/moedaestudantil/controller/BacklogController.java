package br.com.moedaestudantil.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/backlog")
public class BacklogController {

    @GetMapping("/sprint-2")
    public List<String> sprint2() {
        return List.of(
                "CRUD Aluno",
                "CRUD Empresa Parceira",
                "Autenticacao e autorizacao por papeis",
                "Cadastro/listagem de Vantagens"
        );
    }

    @GetMapping("/sprint-3")
    public List<String> sprint3() {
        return List.of(
                "Sprint 3 implementada: distribuicao de moedas com validacao de saldo e mensagem",
                "Sprint 3 implementada: extrato de aluno e professor",
                "Sprint 3 implementada: resgate com codigo unico",
                "Sprint 3 implementada: notificacoes por e-mail (modo log)",
                "Sprint 3 implementada: recarga semestral acumulativa"
        );
    }
}
