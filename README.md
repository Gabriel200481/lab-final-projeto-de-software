<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# Sistema de Moeda Estudantil

> Sistema acadêmico para reconhecimento por mérito estudantil com distribuição de moedas por professores, resgate de vantagens com cupom e QR Code, e notificações por e-mail.

<table>
	<tr>
		<td width="800px">
			<div align="justify">
				Projeto desenvolvido para o Lab 04 da PUC Minas, evoluído ao longo de quatro sprints. A solução entrega um fluxo completo de moeda estudantil: autenticação por perfil (JWT), distribuição de moedas com justificativa, extrato com filtro por período, cadastro e listagem de vantagens por empresas parceiras, resgate com geração de cupom e QR Code, e notificações HTML por e-mail para todos os envolvidos.
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

## Status do Projeto

![Java](https://img.shields.io/badge/Java-21-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Micronaut](https://img.shields.io/badge/Micronaut-4.10-007ec6?style=for-the-badge&logo=micronaut&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9+-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Produção-336791?style=for-the-badge&logo=postgresql&logoColor=white)

| Sprint | Lab | Status |
|---|---|---|
| Sprint 1 | Lab03S01 | Concluída |
| Sprint 2 | Lab03S02 | Concluída |
| Sprint 3 | Lab03S03 | Concluída |
| Sprint 4 / Release 3 | Lab04 | Concluída |

---

## Índice

- [Links Úteis](#links-úteis)
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Diagramas UML](#diagramas-uml)
- [Histórias de Usuário](#histórias-de-usuário)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Demonstração](#demonstração)
- [Testes](#testes)
- [Deploy](#deploy)
- [Documentações Utilizadas](#documentações-utilizadas)
- [Autores](#autores)

---

## Links Úteis

- **Frontend (produção):** https://lab-final-projeto-de-software.vercel.app
- **Backend (produção):** https://lab-final-projeto-de-software.onrender.com/api
- **Backend local:** http://localhost:8080/api
- **Frontend local:** http://localhost:4200/
- **QR Codes:** http://localhost:8080/api/qrcodes/{arquivo}.png
- **Docs Sprint 1:** [docs/sprint-1/README.md](docs/sprint-1/README.md)
- **Docs Sprint 2:** [docs/sprint-2/README.md](docs/sprint-2/README.md)
- **Docs Sprint 3:** [docs/sprint-3/README.md](docs/sprint-3/README.md)
- **Docs Release 3:** [docs/release-3/](docs/release-3/)
- **Diagramas UML:** [uml/](uml/)

---

## Sobre o Projeto

O Sistema de Moeda Estudantil permite que professores reconheçam mérito acadêmico por meio de moedas virtuais distribuídas para alunos. Os alunos podem consultar seu extrato e resgatar vantagens oferecidas por empresas parceiras. Cada resgate gera um cupom com código único e QR Code, com notificações automáticas por e-mail para aluno e empresa.

Contexto: disciplina Laboratório de Desenvolvimento de Software (PUC Minas), com evolução incremental por sprints e rastreabilidade entre modelagem UML e implementação.

---

## Funcionalidades Principais

- **Autenticação por perfil:** login JWT para aluno, professor e empresa parceira.
- **Cadastro de Aluno:** auto-cadastro com vínculo a instituição de ensino.
- **Professor pré-cadastrado:** importado institucionalmente; distribui moedas com mensagem obrigatória.
- **Cadastro de Empresa Parceira:** auto-cadastro com gestão de vantagens.
- **Cadastro de Vantagens:** empresa registra benefícios com descrição, foto e custo em moedas.
- **Listagem de Vantagens:** aluno consulta todas as empresas com suas vantagens disponíveis.
- **Distribuição de Moedas:** professor envia moedas com validação de saldo e justificativa obrigatória.
- **Extrato:** professor e aluno consultam histórico com filtro por período e resumo de saldo.
- **Resgate de Vantagem:** débito automático do saldo do aluno e geração de código único.
- **Cupom com QR Code:** QR Code gerado via ZXing e disponibilizado por URL pública.
- **Notificações HTML por e-mail:** templates HTML por perfil enviados via Gmail SMTP com QR Code embutido inline.
- **Recarga Semestral:** crédito acumulativo de +1000 moedas para professores.

---

## Tecnologias Utilizadas

### Back-end

| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 21 | Linguagem |
| Micronaut | 4.10.12 | Framework web (Netty) |
| Micronaut Security | - | JWT + autenticação por perfil |
| Micronaut Data JPA | - | ORM / repositórios |
| H2 | - | Banco em memória (desenvolvimento) |
| PostgreSQL | - | Banco relacional (produção no Render) |
| ZXing | 3.5.3 | Geração de QR Code (PNG) |
| Spring Mail (angus-mail) | - | Envio de e-mail HTML com inline attachment |
| Maven | 3.9+ | Build |

### Front-end

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 17+ | Framework SPA (standalone components) |
| TypeScript | 5+ | Linguagem |
| Inter (Google Fonts) | - | Tipografia |
| Node.js / npm | 18+ | Toolchain |

### Infraestrutura

| Serviço | Uso |
|---|---|
| Render | Backend Micronaut + PostgreSQL (produção) |
| Vercel | Frontend Angular (produção) |

---

## Arquitetura

Arquitetura em camadas com separação clara de responsabilidades:

```
Frontend (Angular SPA)
        │  HTTP + JWT
        ▼
Controller (REST endpoints por contexto)
        │
Service (regras de negócio, validações, transações)
        │
Repository (Micronaut Data JPA)
        │
Model (entidades JPA)
        │
Database (H2 local / PostgreSQL produção)
```

Serviços transversais chamados pela camada Service:
- **QrCodeService** — gera PNG via ZXing e retorna URL pública
- **NotificacaoService** — envia e-mails HTML com QR Code inline via SMTP

---

## Diagramas UML

Todos os diagramas estão na pasta [uml/](uml/) em formato PlantUML (`.puml`).

| Diagrama | Arquivo |
|---|---|
| Casos de Uso | [uml/casos-de-uso.puml](uml/casos-de-uso.puml) |
| Classes | [uml/diagrama-classes.puml](uml/diagrama-classes.puml) |
| Entidade-Relacionamento | [uml/diagrama-er.puml](uml/diagrama-er.puml) |
| Componentes (MVC) | [uml/diagrama-componentes.puml](uml/diagrama-componentes.puml) |
| Implantação (deploy) | [uml/diagrama-implantacao.puml](uml/diagrama-implantacao.puml) |
| Sequência Geral | [uml/sequencia-geral.puml](uml/sequencia-geral.puml) |
| Sequência: Distribuição de Moedas | [uml/sequencia-distribuicao-moedas.puml](uml/sequencia-distribuicao-moedas.puml) |
| Sequência: Cadastro e Listagem de Vantagens | [uml/sequencia-cadastro-vantagens.puml](uml/sequencia-cadastro-vantagens.puml) |
| Sequência: Resgate de Vantagem | [uml/sequencia-resgate-vantagens.puml](uml/sequencia-resgate-vantagens.puml) |
| Comunicação: Distribuição de Moedas | [uml/diagrama-comunicacao-distribuicao-moedas.puml](uml/diagrama-comunicacao-distribuicao-moedas.puml) |
| Comunicação: Resgate e QR Code | [uml/diagrama-comunicacao-resgate-qrcode.puml](uml/diagrama-comunicacao-resgate-qrcode.puml) |

---

## Histórias de Usuário

Definidas na Sprint 1 e implementadas ao longo das quatro sprints. Arquivo completo: [docs/sprint-1/README.md](docs/sprint-1/README.md).

| ID | História |
|---|---|
| HU-01 | Cadastro de Aluno com vínculo institucional |
| HU-02 | Acesso de professor pré-cadastrado pela instituição |
| HU-03 | Cadastro de Empresa Parceira |
| HU-04 | Autenticação por perfil com JWT |
| HU-05 | Distribuição de moedas pelo professor com mensagem obrigatória e e-mail |
| HU-06 | Consulta de extrato com filtro por período e resumo de saldo |
| HU-07 | Cadastro e listagem de vantagens pela empresa |
| HU-08 | Resgate de vantagem com cupom, QR Code e e-mail |
| HU-09 | Recarga semestral acumulativa de saldo do professor |
| HU-10 | Consulta de instituições de ensino disponíveis |
| HU-11 | Health check público da aplicação |

---

## Instalação e Execução

### Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 18+ e npm (para o frontend)

### Variáveis de Ambiente

O projeto usa H2 em memória localmente. Para o envio de e-mail, configure as variáveis no arquivo `.env` na raiz (ou nas variáveis de ambiente do sistema):

```env
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app-gmail
```

Variáveis opcionais com valores padrão:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_FAIL_ON_ERROR=false
JWT_SECRET=Lab03JwtSecretKeyMuitoSeguraCom32CaracteresMinimo123
APP_QRCODE_BASEPATH=qrcodes/
APP_QRCODE_BASEURL=http://localhost:8080/api/qrcodes/
```

> A senha do Gmail deve ser uma **App Password** gerada em [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), não a senha da conta.

### Executar o Back-end

```bash
cd backend
mvn clean package -DskipTests
mvn mn:run
```

API disponível em: `http://localhost:8080/api`

### Executar o Front-end

```bash
cd frontend
npm install
npm start
```

Frontend disponível em: `http://localhost:4200`

---

## Estrutura de Pastas

```text
.
├── backend/                          # Aplicação Micronaut (Java 21)
│   ├── src/main/java/br/com/moedaestudantil/
│   │   ├── config/                   # Configurações (mail, senha, seed)
│   │   ├── controller/               # Endpoints REST (11 controllers)
│   │   ├── dto/                      # Objetos de transferência de dados
│   │   ├── exception/                # Exceções customizadas e handlers
│   │   ├── model/                    # Entidades JPA (10 entidades)
│   │   ├── repository/               # Repositórios Micronaut Data
│   │   ├── security/                 # JWT e usuário autenticado
│   │   └── service/                  # Regras de negócio (11 serviços)
│   ├── src/main/resources/
│   │   ├── application.yml           # Configuração local (H2)
│   │   ├── application-prod.yml      # Configuração produção (PostgreSQL)
│   │   └── data.sql                  # Dados iniciais (professores, instituições)
│   ├── render.yaml                   # Configuração de deploy no Render
│   └── pom.xml
│
├── frontend/                         # Aplicação Angular 17+
│   └── src/app/
│       ├── pages/                    # Componentes de página (6 páginas)
│       │   ├── login/
│       │   ├── cadastro-aluno/
│       │   ├── cadastro-empresa/
│       │   ├── aluno-dashboard/
│       │   ├── professor-dashboard/
│       │   └── empresa-dashboard/
│       ├── services/                 # api.service.ts, auth.service.ts
│       ├── guards/                   # auth.guard.ts
│       ├── interceptors/             # auth.interceptor.ts (JWT)
│       └── models/                   # usuario.model.ts
│
├── uml/                              # Diagramas PlantUML (11 arquivos)
├── docs/
│   ├── sprint-1/                     # Histórias de usuário (HU-01 a HU-11)
│   ├── sprint-2/                     # Modelo ER, persistência JPA
│   ├── sprint-3/                     # MVC finalizado, guia de demo
│   └── release-3/                    # Checklist de deploy e evidências
├── scripts/                          # Scripts de teste E2E e deploy
├── vercel.json                       # Configuração de deploy do frontend
└── README.md
```

---

## Demonstração

### Fluxo sugerido

1. Acessar o frontend em https://lab-final-projeto-de-software.vercel.app (produção) ou `http://localhost:4200` (local)
2. Cadastrar um aluno (aba "Cadastro de Aluno")
3. Cadastrar uma empresa parceira (aba "Cadastro de Empresa")
4. Fazer login como empresa e cadastrar uma vantagem
5. Fazer login como professor e distribuir moedas para o aluno
6. Fazer login como aluno, consultar extrato e resgatar uma vantagem
7. Verificar e-mails enviados ao aluno e à empresa com cupom e QR Code

### Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Autenticação (retorna JWT) |
| POST | `/api/alunos` | Cadastro de aluno |
| POST | `/api/empresas` | Cadastro de empresa |
| POST | `/api/empresas/{id}/vantagens` | Cadastro de vantagem |
| GET | `/api/empresas` | Listar empresas com vantagens |
| POST | `/api/transacoes/distribuicao` | Distribuir moedas |
| GET | `/api/extratos/alunos/{id}/resumo` | Extrato do aluno |
| GET | `/api/extratos/professores/{id}/resumo` | Extrato do professor |
| POST | `/api/resgates` | Resgatar vantagem (gera cupom + QR Code) |
| GET | `/api/qrcodes/{arquivo}.png` | Visualizar QR Code gerado |
| POST | `/api/saldo-semestral/recarregar` | Recarga semestral de professores |

Arquivo de apoio para chamadas HTTP: [docs/sprint-3/guia-demo.http](docs/sprint-3/guia-demo.http)

---

## Testes

### Testes unitários

- `TransacaoServiceTest` — valida regras de distribuição de moedas.
- `JwtServiceTest` — valida emissão e leitura de claims do token JWT.

```bash
cd backend
mvn test
```

### Testes E2E automatizados

- `scripts/e2e_release3_test.py` — fluxo completo: login, cadastro de vantagem, distribuição, extrato, resgate e validação do QR Code.
- `scripts/e2e_negative_tests.py` — cenários de erro: saldo insuficiente e distribuição sem mensagem.

```bash
python scripts/e2e_release3_test.py
python scripts/e2e_negative_tests.py
```

---

## Deploy

| Componente | Plataforma | URL |
|---|---|---|
| Frontend (Angular) | Vercel | https://lab-final-projeto-de-software.vercel.app |
| Backend (Micronaut) | Render | https://lab-final-projeto-de-software.onrender.com |

### Back-end — Render

Configurado em [render.yaml](render.yaml). O deploy é automático a cada push na `main`.

O backend usa **H2 em memória** por padrão. Para usar PostgreSQL em produção, configure a variável `DATASOURCES_DEFAULT_URL` no painel do Render.

Variáveis opcionais no painel do Render:

```
JWT_SECRET=...                         # secret JWT (tem valor padrão)
MAIL_USERNAME=...                      # Gmail para envio de notificações
MAIL_PASSWORD=...                      # App Password do Gmail
APP_QRCODE_BASEURL=https://lab-final-projeto-de-software.onrender.com/api/qrcodes/
```

> **Atenção (plano free):** o Render hiberna o serviço após 15 min de inatividade. O primeiro acesso pode demorar ~30 segundos para "acordar".

### Front-end — Vercel

Configurado em [vercel.json](vercel.json). O deploy é automático a cada push na `main`. As chamadas `/api/*` são proxiadas automaticamente para o backend no Render.

### Contas de demonstração (seed)

| Perfil | E-mail | Senha |
|---|---|---|
| Professor | `professor.seed@lab03.com` | `password` |
| Aluno | `gabrielvieira200481@gmail.com` | `password` |
| Empresa | `thalescarvalho622@gmail.com` | `password` |

---

## Documentações Utilizadas

- Micronaut: https://docs.micronaut.io/latest/guide/
- Micronaut Security (JWT): https://micronaut-projects.github.io/micronaut-security/latest/guide/
- Micronaut Data JPA: https://micronaut-projects.github.io/micronaut-data/latest/guide/
- ZXing (QR Code): https://github.com/zxing/zxing
- Angular: https://angular.dev/
- PlantUML: https://plantuml.com/
- H2 Database: https://www.h2database.com/html/main.html

---

## Autores

| Nome | GitHub | LinkedIn | E-mail |
|---|---|---|---|
| Gabriel Afonso Infante Vieira | [Gabriel200481](https://github.com/Gabriel200481) | [gabrielvieira2004](https://www.linkedin.com/in/gabrielvieira2004/) | gabrielvieira200481@gmail.com |
| Thales Eduardo | [ThalesMattos](https://github.com/ThalesMattos) | [thalesedu](https://www.linkedin.com/in/thalesedu/) | thalescarvalho622@gmail.com |

---

## Agradecimentos

- Engenharia de Software — PUC Minas
- Prof. Dr. João Paulo Aramuni
- Comunidade de desenvolvimento e boas práticas em arquitetura de software

---

## Licença

Este projeto é distribuído sob a Licença MIT.

---
