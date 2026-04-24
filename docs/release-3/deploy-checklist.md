# Release 3 - Deploy Checklist

## Objetivo
Validar os artefatos e a configuracao final da entrega da Release 3.

## Itens verificados
- [x] Aplicacao MVC consolidada
- [x] Autenticacao JWT configurada
- [x] Fluxo de envio de moedas implementado
- [x] Fluxo de extrato implementado
- [x] Fluxo de cadastro de vantagens implementado
- [x] Fluxo de resgate com cupom e QR Code implementado
- [x] Front-end configurado para Vercel
- [x] Back-end configurado para Render
- [x] QR Codes armazenados em `qrcodes/`
- [x] E-mails de notificacao com fallback seguro

## Observacoes
- O arquivo `render.yaml` descreve o servico Java e as variaveis de ambiente.
- O arquivo `vercel.json` aponta o output do front-end estatico.
- O projeto foi organizado para demonstracao da Release 3 com foco em prototipo funcional.
