<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# 🏷️ Sistema de Moeda Estudantil 👨‍💻

> [!NOTE]
> Sistema acadêmico para reconhecimento por mérito estudantil com distribuição de moedas por professores, extrato, resgate de vantagens e notificações.

<table>
	<tr>
		<td width="800px">
			<div align="justify">
				Este projeto foi desenvolvido para o Lab 03 da PUC Minas, consolidando as três sprints de desenvolvimento de software com foco em modelagem, implementação MVC e finalização técnica. A solução entrega um fluxo completo de moeda estudantil com persistência relacional, regras de negócio para distribuição e resgate, e rastreabilidade entre modelagem UML e código implementado.
			</div>
		</td>
		<td>
			<div>
				<img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo do Projeto" width="120px"/>
			</div>
		</td>
	</tr>
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue)](#)
[![CI](https://github.com/Gabriel200481/Lab_03_projeto/actions/workflows/ci.yml/badge.svg)](https://github.com/Gabriel200481/Lab_03_projeto/actions/workflows/ci.yml)
![Java](https://img.shields.io/badge/Java-22-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.13-007ec6?style=for-the-badge&logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9+-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white)
![H2](https://img.shields.io/badge/H2-Database-007ec6?style=for-the-badge)

- Sprint 1 (Lab03S01): concluída
- Sprint 2 (Lab03S02): concluída
- Sprint 3 (Lab03S03): concluída
- Sprint Final (Lab05 - Release 3): concluida

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Local:** http://localhost:8080/
* 📖 **Documentação Sprint 1:** ./docs/sprint-1
* 📖 **Documentação Sprint 2:** ./docs/sprint-2
* 📖 **Documentação Sprint 3:** ./docs/sprint-3
* 🧩 **Diagramas UML:** ./uml

---

## 📝 Sobre o Projeto
O Sistema de Moeda Estudantil foi criado para permitir que professores reconheçam mérito acadêmico por meio de moedas virtuais distribuídas para alunos, que podem consultar extrato e resgatar vantagens oferecidas por empresas parceiras.

O projeto resolve o problema de falta de um mecanismo transparente de incentivo acadêmico, entregando rastreabilidade de transações, validações de saldo, justificativa obrigatória de envio e geração de código único no resgate.

Contexto de uso: disciplina Laboratório de Desenvolvimento de Software (PUC Minas), com evolução incremental por sprints e alinhamento entre UML e implementação real.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** login por perfil de usuário.
- 👨‍🎓 **CRUD de Aluno:** cadastro, listagem, atualização e remoção.
- 👨‍🏫 **CRUD de Professor (fluxo institucional):** listagem, atualização e remoção; criação restrita a contexto autenticado.
- 🏢 **CRUD de Empresa Parceira:** cadastro, listagem, atualização e remoção.
- 🎁 **Cadastro de Vantagens:** empresa cadastra vantagens com descrição, foto e custo.
- 💸 **Distribuição de Moedas:** professor envia moedas com validação de saldo e mensagem obrigatória.
- 📊 **Extrato:** consulta de extrato para professor e aluno com total consolidado do periodo, saldo atual e historico (recebimentos e resgates no caso do aluno).
- 🎟️ **Resgate de Vantagem:** débito automático de saldo e geração de código único.
- 🧾 **Cupom com QR Code:** geração de QR Code por resgate com endpoint interno para validação visual.
- 📨 **Notificações:** envio de e-mail ao aluno no recebimento de moedas e confirmações no resgate (via SMTP, com fallback seguro).
- 📩 **Confirmação ao Professor:** envio de confirmação de distribuição de moedas para o professor.
- 📆 **Recarga Semestral:** crédito acumulativo de +1000 moedas para professor.

---

## 🛠 Tecnologias Utilizadas

### 🖥️ Back-end
* **Linguagem/Runtime:** Java 22
* **Framework:** Spring Boot 3.5.13
* **Banco de Dados:** H2 (memória)
* **ORM:** Spring Data JPA / Hibernate
* **Autenticação:** Spring Security + JWT (controle por perfil)

### 💻 Front-end
* **Abordagem:** páginas estáticas HTML/CSS/JS para apoio de cadastro e demonstração

### ⚙️ Infraestrutura & DevOps
* **Build:** Maven
* **Cloud:** Render (backend + banco) e Vercel (frontend estatico)

---

## 🏗 Arquitetura

Arquitetura MVC com separação clara:
- **Model:** entidades JPA e repositórios
- **Controller:** endpoints REST por contexto de negócio
- **Service:** regras de negócio, validações e transações

### Exemplos de diagramas

| Diagrama | Link |
| :---: | :---: |
| Casos de Uso | ./uml/casos-de-uso.puml |
| Classes | ./uml/diagrama-classes.puml |
| Componentes (MVC) | ./uml/diagrama-componentes.puml |
| Modelo ER | ./uml/diagrama-er.puml |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* Java JDK 22+
* Maven 3.9+

### 🔑 Variáveis de Ambiente

Este projeto está configurado para execução local com H2 em memória pelo arquivo application.yml.

Variáveis principais (valores de teste):
- `MAIL_HOST=smtp.gmail.com`
- `MAIL_PORT=587`
- `MAIL_USERNAME=email.teste.lab03@gmail.com`
- `MAIL_PASSWORD=senha-fake-lab03-123`
- `MAIL_FAIL_ON_ERROR=false`
- `JWT_SECRET=Lab03JwtSecretKeyMuitoSeguraCom32CaracteresMinimo123`

### 📦 Instalação de Dependências

```bash
git clone https://github.com/Gabriel200481/Lab_03_projeto.git
cd Lab_03_projeto
mvn clean install
```

### ⚡ Como Executar a Aplicação

```bash
mvn spring-boot:run
```

Aplicação e API:
- Home: http://localhost:8080/
- API: http://localhost:8080/api
- QR Codes: http://localhost:8080/api/qrcodes/{arquivo}.png
- H2 Console: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:moedaestudantil

---

## 🚀 Deploy

Build do projeto:

```bash
mvn clean package
```

Execução via JAR:

```bash
java -jar target/moeda-estudantil-0.0.1-SNAPSHOT.jar
```

Deploy para Release 3:
- Front-end: Vercel (configurado em `vercel.json` com output em `src/main/resources/static`)
- Back-end e banco: Render + PostgreSQL (arquivo `render.yaml` e perfil `application-prod.yml`)

Artefatos operacionais:
- Script de deploy frontend: `scripts/deploy_frontend_vercel.cmd`
- Script de validacao local: `scripts/validar_release.cmd`
- Checklist de deploy e evidencias: `docs/release-3/deploy-checklist.md` e `docs/release-3/evidencias-execucao.md`

---

## 📂 Estrutura de Pastas

```text
.
├── docs/
│   ├── sprint-1/
│   ├── sprint-2/
│   └── sprint-3/
├── src/
│   ├── main/java/br/com/moedaestudantil/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── main/resources/
│       ├── static/
│       ├── application.yml
│       └── data.sql
└── uml/
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

Fluxo sugerido para demo:
1. Cadastrar aluno e empresa
2. Cadastrar vantagem para empresa
3. Distribuir moedas para aluno
4. Consultar extratos
5. Resgatar vantagem
6. Aplicar recarga semestral

Arquivo de apoio para chamadas HTTP:
- ./docs/sprint-3/guia-demo.http

---

## 🧪 Testes

Testes unitários adicionados:
- `TransacaoServiceTest`: valida regras de distribuição de moedas.
- `JwtServiceTest`: valida emissão e leitura de claims do token JWT.

Testes E2E automatizados adicionados:
- `scripts/e2e_release3_test.py`: fluxo completo (login, cadastro de vantagem, distribuição, extrato, resgate e validação do QR Code).
- `scripts/e2e_negative_tests.py`: cenários de erro esperados (saldo insuficiente e distribuição sem mensagem).

Validação final executada em 18/04/2026:
- `mvn test` -> todos os testes automatizados passaram.
- E2E positivo -> concluído com sucesso (QR Code retornando HTTP 200).
- E2E negativo -> concluído com sucesso (HTTP 400 para regras inválidas).

Execução dos testes:

```bash
mvn test
```

---

## 🔗 Documentações utilizadas

* Spring Boot: https://docs.spring.io/spring-boot/docs/current/reference/html/
* Spring Data JPA: https://docs.spring.io/spring-data/jpa/reference/
* Spring Security: https://docs.spring.io/spring-security/reference/
* H2 Database: https://www.h2database.com/html/main.html
* PlantUML: https://plantuml.com/

---

## 👥 Autores

| 👤 Nome | GitHub | LinkedIn | Gmail |
|---|---|---|---|
| Gabriel Afonso Infante Vieira | https://github.com/Gabriel200481 | https://www.linkedin.com/in/gabrielvieira2004/ | mailto:gabrielvieira200481@gmail.com |
| Thales Eduardo | https://github.com/ThalesMattos | https://www.linkedin.com/in/thalesedu/ | mailto:thalescarvalho622@gmail.com |

---

## 🤝 Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature.
3. Commit suas mudanças com Conventional Commits.
4. Faça push para a branch.
5. Abra um Pull Request.

---

## 🙏 Agradecimentos

* Engenharia de Software PUC Minas
* Prof. Dr. João Paulo Aramuni
* Comunidade de desenvolvimento e boas práticas em arquitetura de software

---

## 📄 Licença

Este projeto é distribuído sob a Licença MIT.

---
