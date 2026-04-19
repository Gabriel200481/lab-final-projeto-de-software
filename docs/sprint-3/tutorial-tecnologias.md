# Tutorial de Tecnologias (20 min)

## 1. Spring Boot (6 min)

- Conceitos: starter, auto-configuracao, controller/service/repository
- Onde esta no projeto:
  - `src/main/java/br/com/moedaestudantil/controller`
  - `src/main/java/br/com/moedaestudantil/service`
- Demonstre um endpoint real: `POST /api/transacoes/distribuicao`

## 2. Spring Data JPA + H2/PostgreSQL (5 min)

- Conceitos: entidades, repositorios, queries derivadas
- Onde esta no projeto:
  - `src/main/java/br/com/moedaestudantil/model`
  - `src/main/java/br/com/moedaestudantil/repository`
- Mostre `data.sql` e o fluxo de persistencia

## 3. Spring Security + JWT (4 min)

- Conceitos: autenticacao stateless e autorizacao por papel
- Onde esta no projeto:
  - `src/main/java/br/com/moedaestudantil/config/SecurityConfig.java`
  - `src/main/java/br/com/moedaestudantil/security/JwtService.java`

## 4. QR Code + Email (3 min)

- Conceitos: cupom com codigo unico e QR para validacao
- Onde esta no projeto:
  - `src/main/java/br/com/moedaestudantil/service/ResgateService.java`
  - `src/main/java/br/com/moedaestudantil/service/QrCodeService.java`
  - `src/main/java/br/com/moedaestudantil/service/NotificacaoService.java`

## 5. Front-end estatico e deploy (2 min)

- Arquivos: `src/main/resources/static`
- Deploy frontend: `vercel.json`
- Deploy backend: `render.yaml`
