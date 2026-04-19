# Evidencias de Execucao - Release 3

## 1) Testes apos mudancas

Comando executado:

- `mvn -Djava.version=22 test`

Resultado:

- BUILD SUCCESS
- Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
- Revalidado novamente no estado final do repositorio em 18/04/2026 com o mesmo resultado.

## 2) Tentativa de deploy Vercel

Comando executado:

- `npx -y vercel@51.7.0 --prod --yes`

Resultado:

- Falha de autenticacao: `The specified token is not valid. Use vercel login to generate a new token.`

Status:

- Bloqueado por credencial de conta (token invalido/ausente no ambiente).

## 3) Deploy backend Render

Status:

- Repositorio preparado com `render.yaml`.
- Deploy depende de credenciais no dashboard Render ou API key valida.

## 4) Proximos passos operacionais

1. Gerar token Vercel e executar:
   - `scripts\\deploy_frontend_vercel.cmd <TOKEN>`
2. Criar Web Service na Render usando `render.yaml`.
3. Configurar variaveis de ambiente na Render.
4. Preencher URLs finais em `docs/release-3/deploy-checklist.md`.
