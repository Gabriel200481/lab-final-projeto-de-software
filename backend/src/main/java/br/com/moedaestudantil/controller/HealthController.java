package br.com.moedaestudantil.controller;

import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Controller;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller("/health")
public class HealthController {

    @Get
    public String health() {
        return "ok";
    }
}



