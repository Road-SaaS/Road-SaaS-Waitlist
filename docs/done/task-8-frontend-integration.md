# Task 8 — Integracao no Frontend (chamar API real)

**Status:** Concluida
**Data:** 2026-02-20

---

## O que foi feito

### 1. `components/waitlist-form.tsx` — atualizado

Mudancas:
- Removido `setTimeout` simulado
- Adicionado `fetch("/api/waitlist", { method: "POST" })` com body real
- Email sempre `trim()` antes de enviar
- Envia UTMs + referrer + landingPath junto no payload
- Captura UTMs no `useEffect` (primeira renderizacao)

Tratamento de respostas:
- `201/200` → estado "success" com mensagem diferenciada
- `200 + alreadySubscribed` → "Voce ja esta na lista!"
- `429` → estado "rate-limited" com mensagem em laranja
- Erro generico → estado "error" sem vazar detalhes do servidor

Novo estado `rate-limited` na UI com mensagem dedicada.

### 2. `lib/client/utm.ts` — criado

- `captureUtms()` — captura UTMs da URL na primeira visita e salva no localStorage
- `getUtmData()` — retorna UTMs + referrer + landingPath para enviar no form
- TTL de 7 dias (expira UTMs antigas para nao poluir attribution)
- Graceful fallback se localStorage indisponivel

### Arquivos criados/modificados

- **Modificado:** `components/waitlist-form.tsx` (setTimeout → fetch real)
- **Criado:** `lib/client/utm.ts` (captura e persistencia de UTMs)
