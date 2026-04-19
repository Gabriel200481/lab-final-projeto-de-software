# Release 3 - Deploy Checklist

## Objetivo

Comprovar a implantacao da aplicacao em nuvem com frontend e backend separados.

## Frontend (Vercel)

- [x] Arquivo de configuracao presente: `vercel.json`
- [x] Diretorio publicado: `src/main/resources/static`
- [ ] URL final publicada
- [ ] Projeto vinculado em conta Vercel

Comando pronto para uso:

- `scripts\\deploy_frontend_vercel.cmd <TOKEN_VERCEL>`

## Backend (Render)

- [x] Arquivo de configuracao presente: `render.yaml`
- [x] Perfil de producao: `src/main/resources/application-prod.yml`
- [ ] Servico criado na Render
- [ ] URL final publicada
- [ ] Variaveis obrigatorias configuradas:
  - `DATABASE_URL`
  - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
  - `JWT_SECRET`
  - `APP_QRCODE_BASEURL`

## Banco

- Producao: PostgreSQL
- Local dev/teste: H2 em memoria

## Evidencias para avaliacao

- [ ] Link Vercel
- [ ] Link Render
- [ ] Video curto de fluxo completo: login -> distribuicao -> extrato -> resgate com QR
- [ ] Print de email recebido com codigo de cupom
- [x] Evidencia tecnica de execucao local: `docs/release-3/evidencias-execucao.md`

## Estado atual

- Codigo e documentacao tecnica preparados para deploy.
- Testes locais apos mudancas executados com sucesso.
- Deploy externo bloqueado por credenciais nao disponiveis no ambiente atual.
