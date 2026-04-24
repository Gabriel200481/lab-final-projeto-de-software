package br.com.moedaestudantil.controller;

import java.util.List;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Controller;

@Controller("/backlog")
public class BacklogController {

    @Get("/sprint-2")
    public List<String> sprint2() {
        return List.of(
                "CRUD Aluno",
                "CRUD Empresa Parceira",
                "Autenticacao e autorizacao por papeis",
                "Cadastro/listagem de Vantagens"
        );
    }

    @Get("/sprint-3")
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



