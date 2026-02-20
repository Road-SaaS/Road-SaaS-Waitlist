# Segurança — Waitlist RoadSaaS

Checklist e comandos para verificação de segurança (ver análise em plano de cybersecurity).

## 1. Secrets e variáveis de ambiente

### Verificar se `.env.local` está versionado

Execute no diretório do projeto:

```bash
git status -- .env.local
git log --oneline -- .env.local
```

- Se `git status` mostrar o arquivo como **untracked** ou **ignored**, está correto.
- Se `git log` listar commits, **`.env.local` já foi commitado**. Nesse caso:
  1. Considere todas as chaves comprometidas.
  2. Rotacione: Supabase (service role), Upstash (URL + token), Resend (API key), `WAITLIST_UNSUBSCRIBE_SECRET`.
  3. Remova o arquivo do histórico (ex.: `git filter-branch` ou BFG) ou crie um novo repositório sem o histórico sensível.
  4. Nunca commite novamente arquivos com segredos reais.

### Garantir que `.env.local` nunca seja commitado

O `.gitignore` já contém `.env*.local`. Antes de cada commit, confira:

```bash
git check-ignore -v .env.local
```

Deve indicar que `.env.local` é ignorado.

---

## 2. Headers de segurança

Headers de segurança estão configurados em `next.config.mjs`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 3. Rotas API (implementadas)

`POST /api/waitlist` e `POST /api/waitlist/unsubscribe`:

- Validar payload com Zod; limitar tamanho dos campos (ex.: strings máx. 500 caracteres).
- Usar sempre parâmetros (Supabase client); nunca concatenar input do usuário em SQL.
- Construir `unsubscribeUrl` apenas no servidor: `PUBLIC_BASE_URL` + path fixo + token gerado; armazenar apenas hash do token no DB.
- Não retornar stack traces nem mensagens internas ao client; retornar 429 com `Retry-After` quando em rate limit.
- Obter IP de headers confiáveis (ex.: `x-forwarded-for`, `x-real-ip` atrás de proxy); hashear antes de persistir (`ip_hash`).
- **Em uso:** Ambas as rotas aplicam `isAllowedOrigin` e não retornam `details` de validação no 400 (apenas "Dados invalidos" + log no servidor).

---

## 4. CSRF nas rotas POST

- **Implementado:** `POST /api/waitlist` e `POST /api/waitlist/unsubscribe` usam `isAllowedOrigin(request.headers, env().PUBLIC_BASE_URL)` de `lib/security/request-origin.ts`. Se a origem não for permitida, respondem com `403 Forbidden`.
- Manter `Content-Type: application/json` e validar payload no servidor; não confiar em dados do client sem validação.

---

## 5. Manutenção

- Script de migration: usa `env()` de `lib/env.ts` para validar variáveis antes de usar.
- Dependências: rodar `pnpm audit` (ou equivalente) e manter pacotes atualizados.
- TypeScript: remover `ignoreBuildErrors` quando o projeto estiver estável (ver `next.config.mjs`).
- Helper de origem: `lib/security/request-origin.ts` — em uso nas rotas POST para validar Origin/Referer.

---

## 6. Revalidação pós-tasks (docs/done)

Após conclusão das tasks em `docs/done/` (rotas API, frontend, email, LGPD etc.), foi feita nova checagem:

| Item | Status |
|------|--------|
| Validação Zod + max length nos payloads | OK (email 320, UTMs 500, referrer/landingPath 2000) |
| Token de descadastro: 32 bytes random, só hash no DB | OK |
| unsubscribeUrl montada só no servidor; template valida publicBaseUrl + protocolo | OK |
| IP só como hash (ip_hash); nunca em claro | OK |
| Rate limit antes de Supabase; 429 com Retry-After | OK |
| Respostas 500/400 sem stack trace nem detalhes internos ao client | OK (detalhes de validação apenas em log) |
| Checagem Origin (CSRF) nas duas rotas POST | OK (isAllowedOrigin aplicado) |
| Página /unsubscribe: token só no body do POST, não refletido em HTML | OK (sem XSS) |
| Frontend: mensagens de erro genéricas, sem vazar resposta do servidor | OK |
