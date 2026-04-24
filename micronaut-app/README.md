# Micronaut Migration Module

Este modulo contem a migracao do projeto para Micronaut em paralelo ao backend Spring original.

## Executar

Prerequisito: JDK 25 e JAVA_HOME configurado.

```bash
mvn clean test
mvn mn:run
```

Aplicacao local: http://localhost:8080

## Principais diferencas
- Bootstrap em Micronaut (Micronaut.run)
- Controllers com anotacoes io.micronaut.http.annotation
- Repositorios com Micronaut Data JPA
- Seguranca JWT via micronaut.security.intercept-url-map
- Handlers de excecao nativos do Micronaut
- Professores sao carregados por importacao institucional, sem cadastro publico via API.

## Documentacao de migracao
- docs/migration/phase-0-baseline.md
- docs/migration/phase-5-validation.md
- docs/migration/phase-6-cutover-rollback.md
