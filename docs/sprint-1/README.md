# Sprint 1 (Lab03S01)

## Entregas

- Diagrama de casos de uso: `uml/casos-de-uso.puml`
- Historias de usuario: descritas neste arquivo e no backlog da equipe
- Diagrama de classes: `uml/diagrama-classes.puml`
- Diagrama de componentes: `uml/diagrama-componentes.puml`

## Historias de Usuario (cobertura implementada)

### HU-01 - Cadastro de Aluno
Como aluno, quero me cadastrar informando meus dados e minha instituicao/curso, para participar do sistema de moeda estudantil.

Criterios de aceitacao:
- Deve permitir cadastro com nome, email, senha, CPF, instituicao e curso.
- Nao deve permitir email ou CPF ja cadastrados.
- Deve registrar o usuario com perfil de aluno.

### HU-02 - Professor Pre-Cadastrado pela Instituicao
Como professor pre-cadastrado pela instituicao, quero acessar o sistema com meu login, para distribuir moedas aos alunos vinculados.

Criterios de aceitacao:
- Deve existir um registro previo do professor com nome, CPF, departamento e instituicao.
- Deve permitir autenticacao com login e senha cadastrados.
- Nao deve permitir acesso sem vinculo institucional valido.

### HU-03 - Cadastro de Empresa Parceira
Como empresa parceira, quero me cadastrar, para publicar vantagens no sistema.

Criterios de aceitacao:
- Deve permitir cadastro com nome, email, senha e nome fantasia.
- Deve registrar o usuario com perfil de empresa.
- Nao deve permitir email duplicado.

### HU-04 - Autenticacao no Sistema
Como usuario (aluno, professor ou empresa), quero entrar no sistema com email e senha, para acessar apenas as funcionalidades do meu perfil.

Criterios de aceitacao:
- Deve autenticar com email e senha validos.
- Deve impedir acesso com credenciais invalidas.
- Deve emitir token para requisicoes autenticadas.

### HU-05 - Distribuicao de Moedas por Professor
Como professor, quero distribuir moedas para alunos com uma mensagem de justificativa, para reconhecer merito academico.

Criterios de aceitacao:
- Deve permitir informar aluno destinatario, quantidade de moedas e mensagem.
- Nao deve permitir distribuicao sem mensagem.
- Nao deve permitir distribuicao acima do saldo disponivel do professor.
- Deve registrar a transacao no historico do professor e do aluno.
- Deve enviar notificacao por e-mail para aluno e professor.

### HU-06 - Consulta de Extrato e Resumo
Como aluno ou professor, quero consultar meu extrato e um resumo consolidado, para acompanhar movimentacoes e saldo.

Criterios de aceitacao:
- Deve listar extrato de aluno e professor autenticados.
- Deve permitir filtro por periodo (dataInicio e dataFim).
- Deve retornar resumo com saldo atual e total movimentado no periodo.
- No extrato do aluno, deve incluir resgates com valor negativo.

### HU-07 - Cadastro e Listagem de Vantagens
Como empresa parceira, quero cadastrar e listar vantagens, para disponibilizar beneficios para resgate.

Criterios de aceitacao:
- Deve permitir cadastrar descricao, foto e custo em moedas.
- Deve vincular vantagem a empresa autenticada.
- Deve listar vantagens da empresa.

### HU-08 - Resgate de Vantagem com Cupom e QR Code
Como aluno, quero resgatar uma vantagem e receber codigo unico com QR Code, para usar o beneficio com validacao.

Criterios de aceitacao:
- Deve validar saldo do aluno antes do resgate.
- Deve debitar moedas do aluno ao concluir o resgate.
- Deve gerar codigo unico de resgate.
- Deve gerar cupom com URL publica de QR Code.
- Deve enviar notificacao por e-mail para aluno e empresa.

### HU-09 - Recarga Semestral de Saldo de Professor
Como professor, quero receber recarga semestral acumulativa de moedas, para continuar distribuindo ao longo dos periodos.

Criterios de aceitacao:
- Deve aplicar recarga de 1000 moedas por execucao.
- Deve permitir aplicacao para todos os professores.
- Deve permitir aplicacao para um professor especifico.

### HU-10 - Consulta de Instituicoes
Como usuario em cadastro, quero consultar instituicoes disponiveis, para selecionar minha instituicao corretamente.

Criterios de aceitacao:
- Deve retornar lista de instituicoes cadastradas.
- Deve permitir consulta sem autenticacao.

### HU-11 - Monitoramento Basico da Aplicacao
Como usuario ou avaliador, quero consultar o status basico da aplicacao, para verificar se o sistema esta disponivel.

Criterios de aceitacao:
- Deve expor endpoint de health check retornando status simples.
- Deve permitir acesso publico ao health check.

## Evidencias no codigo

- Modelo principal: `src/main/java/br/com/moedaestudantil/model`
- Controllers MVC: `src/main/java/br/com/moedaestudantil/controller`
- Regras de negocio: `src/main/java/br/com/moedaestudantil/service`
