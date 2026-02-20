# Task 7 — Email transacional (Resend)

**Status:** Concluida (implementada na Task 1, validacao XSS adicionada via linter)
**Data:** 2026-02-20

---

## O que foi feito

### 7.1 Cliente Resend: `lib/email/resend-client.ts`
- Singleton com lazy init do `Resend`
- Funcao `sendWaitlistWelcomeEmail({ to, unsubscribeUrl })` com SRP
- Usa `PUBLIC_BASE_URL` para validar URL de descadastro

### 7.2 Template: `lib/email/templates/waitlist-welcome.ts`
- Subject: "Voce esta na lista — RoadSaaS"
- Corpo: confirmacao, proximos passos, link de descadastro
- HTML inline (compativel com clientes de email)
- Paleta RoadSaaS (#121212, #1C1C1C, #FF6B00, #E5E5E5)
- Validacao de seguranca: `assertUnsubscribeUrlSafe()` previne XSS via `javascript:` / `data:`
- From: usa `RESEND_FROM_EMAIL` da env (`contato@roadsaas.com`)

### Testes: `tests/resend.test.ts` (5 testes)

| Teste | Valida |
|-------|--------|
| Template gera subject e html validos | Conteudo correto |
| Rejeita URL que nao comeca com PUBLIC_BASE_URL | Seguranca |
| Rejeita protocolo nao-http | Previne XSS |
| Link de descadastro no html | href correto |
| Envio real para delivered@resend.dev | API key + envio funcionam |
