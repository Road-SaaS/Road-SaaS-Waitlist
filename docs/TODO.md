# TODO — Waitlist MVP (Supabase + Upstash Redis + Resend + UTMiFy)
RoadSaaS — implementação mínima “produção de verdade” para capturar emails com persistência, anti-abuso, email transacional e tracking.

> Estado atual (evidência): o form em `components/waitlist-form.tsx` **simula** sucesso com `setTimeout` (não grava em DB, não envia email, não tem rate limit).

---

## 0) Objetivo e escopo (MVP)
### Objetivo
- Capturar email (único) + metadados (UTM/referrer) e **persistir no Supabase**.
- Proteger contra spam/bots com **rate limit (Upstash Redis)**.
- Enviar email transacional via **Resend** (“você entrou na lista”) com **link de descadastro**.
- Capturar UTMs via **UTMiFy** + armazenar no DB (pra attribution).

### Fora do escopo (por enquanto)
- Double opt-in (confirmar email)
- Programa de referral
- Segmentação avançada/lead scoring
- Sequência de emails (drip)

---

## 1) Dependências + organização de código (SRP/SoC)
### 1.1 Adicionar dependências
**Arquivos**
- `v0-road-saa-s-waitlist-page/package.json`

**Tarefas**
- [x] Instalar Supabase: `@supabase/supabase-js`
- [x] Instalar Upstash: `@upstash/redis` e `@upstash/ratelimit`
- [x] Instalar Resend: `resend`
- [x] (Opcional) validação server-side robusta: `zod` já existe no repo, usar.

**Boas práticas**
- Preferir wrappers internos com responsabilidade única:
  - `lib/env.ts` (validar envs)
  - `lib/supabase/admin.ts` (cliente supabase server-only)
  - `lib/rate-limit/waitlist.ts` (limitador)
  - `lib/email/resend-client.ts` (cliente resend)
  - `lib/email/templates/waitlist-welcome.ts` (template email)

---

## 2) Variáveis de ambiente (segurança)
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/.env.local` (não commitar)
- Criar: `v0-road-saa-s-waitlist-page/.env.example` (commitar)

**Tarefas**
- [x] Definir envs do Supabase (server-only):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (NUNCA no client)
- [x] Definir envs do Upstash:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- [x] Definir envs do Resend:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL` (ex: `noreply@roadsaas.com` ou `oi@roadsaas.com`)
- [x] Definir segredo para tokens:
  - `WAITLIST_UNSUBSCRIBE_SECRET` (string forte)
- [x] Definir base URL:
  - `PUBLIC_BASE_URL` (ex: `https://roadsaas.com`)

**Boas práticas**
- Validar envs em runtime no server (falhar rápido) via `lib/env.ts`.
- `SERVICE_ROLE_KEY` só no servidor (Route Handlers / Server Actions).

---

## 3) Banco de dados (Supabase) — schema mínimo
### 3.1 Criar tabela `waitlist_signups`
**Onde**
- Supabase SQL editor (ou migrations no seu fluxo)

**Tarefas (SQL)**
- [x] Criar tabela com campos mínimos:

Campos recomendados (MVP):
- `id` UUID PK
- `email` TEXT (original)
- `email_normalized` TEXT (lower(trim(email))) **UNIQUE**
- `status` TEXT default `'subscribed'`
- `created_at` TIMESTAMPTZ default now()
- `source` TEXT (ex: `'landing'`)
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` TEXT nullable
- `referrer` TEXT nullable
- `landing_path` TEXT nullable
- `user_agent` TEXT nullable
- `ip_hash` TEXT nullable (não guardar IP puro)
- `unsubscribe_token_hash` TEXT nullable
- `unsubscribed_at` TIMESTAMPTZ nullable

**Boas práticas**
- **Deduplicação** por `email_normalized` com índice único.
- Guardar `ip_hash` (ex: sha256(ip + secret)) em vez de IP puro (LGPD).
- Se quiser RLS: pode ativar, mas como o insert será via service role, você pode começar sem RLS e ativar depois com calma.

---

## 4) Cliente Supabase (server-only)
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/lib/supabase/admin.ts`

**Tarefas**
- [x] Implementar `createSupabaseAdminClient()` usando `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
- [x] Garantir que esse arquivo só é importado em server (Route Handlers).

**Boas práticas**
- Nunca importar esse cliente em componentes React client.
- Se possível, adicionar uma proteção simples:
  - `if (typeof window !== "undefined") throw new Error("server-only")`

---

## 5) Rate limit (Upstash Redis)
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/lib/rate-limit/waitlist.ts`

**Tarefas**
- [x] Criar um limiter para a rota de waitlist (exemplos):
  - por IP: `5 req / 10 min`
  - e/ou por IP+email_normalized: `3 req / 10 min`
- [x] Extrair IP corretamente no Next (headers `x-forwarded-for`, `x-real-ip`). *(implementado na Task 6)*
- [x] Retornar `429` com mensagem consistente quando estourar. *(implementado na Task 6)*

**Boas práticas**
- Aplicar rate limit **antes** de bater no Supabase (economia + proteção).
- Normalizar email antes de rate limit por email (evita bypass com maiúsculas/espacos).

---

## 6) Rotas necessárias (Next App Router)
> Você pediu “todas as rotas necessárias”. Para MVP com single opt-in, são 2 rotas + (opcional) 1 página.

### 6.1 `POST /api/waitlist` (criar inscrição)
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/app/api/waitlist/route.ts`

**Tarefas**
- [x] Validar payload com Zod:
  - `email` obrigatório
  - `utm_*`, `referrer`, `landingPath` opcionais
- [x] Aplicar rate limit (Upstash).
- [x] Normalizar email (`email_normalized`).
- [x] Inserir no Supabase:
  - Se sucesso: `201`
  - Se duplicado: **recomendado** retornar `200` com `alreadySubscribed: true` (melhor UX; evita "erro" e reduz suporte)
- [x] Gerar `unsubscribe_token` (random) e salvar **hash** no registro (ou gerar token a partir do `id` com HMAC).
- [x] Disparar email via Resend (ver sessão 7).
- [x] Resposta JSON consistente, ex: json
{ "ok": true, "status": "subscribed", "alreadySubscribed": false }

**Boas práticas**
- Não confiar em UTM vindo do client (mas aceitar e armazenar).
- Logar no server (mínimo) erros de Supabase/Resend (console ok no MVP).
- Timeouts: garantir que Resend não bloqueie demais (se necessário, enviar “fire-and-forget” e manter resposta rápida).

### 6.2 `POST /api/waitlist/unsubscribe` (descadastro)
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/app/api/waitlist/unsubscribe/route.ts`

**Tarefas**
- [x] Receber `token` (body) ou `token` (query). Para API, prefira `POST` body.
- [x] Validar token (formato/tamanho).
- [x] Calcular hash do token e buscar registro.
- [x] Marcar `status='unsubscribed'` e setar `unsubscribed_at=now()`.
- [x] Responder `200 { ok: true }` mesmo se já estava unsubscribed (idempotente).

**Boas práticas**
- Token **não pode** ser o `id` puro (evita enumeração).
- Idempotência reduz suporte.

### 6.3 (Opcional, recomendado) página de confirmação de descadastro
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/app/unsubscribe/page.tsx`

**Tarefas**
- [x] Ler `?token=` da URL.
- [x] Chamar `POST /api/waitlist/unsubscribe`.
- [x] Mostrar estado: loading/sucesso/erro.

---

## 7) Email transacional (Resend)
### 7.1 Cliente Resend
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/lib/email/resend-client.ts`

**Tarefas**
- [x] Instanciar Resend com `RESEND_API_KEY`.
- [x] Exportar função SRP: `sendWaitlistWelcomeEmail({ to, unsubscribeUrl })`.

### 7.2 Template do email
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/lib/email/templates/waitlist-welcome.ts`

**Conteúdo mínimo**
- Subject direto (tom RoadSaaS)
- Corpo curto:
  - confirmação “você entrou”
  - o que acontece agora (“um email quando abrir”)
  - link de descadastro

**Boas práticas**
- From consistente (ex: `oi@roadsaas.com` futuro, ou `noreply@roadsaas.com`).
- Incluir cabeçalhos/metadata se você rastrear bounces depois (MVP pode ignorar).
- Não prometer datas se você não tem.

---

## 8) Integração no Frontend (chamar API real)
**Arquivos**
- Atualizar: `v0-road-saa-s-waitlist-page/components/waitlist-form.tsx`
- (Opcional) Criar: `v0-road-saa-s-waitlist-page/lib/client/utm.ts`

**Tarefas**
- [x] Substituir o `setTimeout` por `fetch("/api/waitlist", { method: "POST", body })`.
- [x] Enviar junto:
  - `email`
  - UTMs + referrer + landing path (ver sessão 9)
- [x] Tratar respostas:
  - `201/200`: sucesso (mensagem normal)
  - `429`: mensagem "calma, tenta de novo em alguns minutos"
  - `5xx`: mensagem de erro genérica (sem stack)
- [x] Ajustar copy do sucesso para diferenciar:
  - já estava na lista vs entrou agora (opcional)

**Boas práticas**
- Sempre `trim()` no email antes de enviar.
- Não bloquear UI se a API demorar (loading state já existe).
- Evitar vazar detalhes de erro do servidor pro usuário.

---

## 9) UTM + UTMiFy (attribution)
> Você vai usar UTMiFy. O MVP aqui é: **capturar UTMs e salvar no DB** + manter UTMiFy funcionando na página.

**Arquivos**
- (Provável) `v0-road-saa-s-waitlist-page/app/layout.tsx` ou `app/page.tsx` (onde você injeta scripts)
- Criar: `v0-road-saa-s-waitlist-page/lib/client/utm.ts`

**Tarefas**
- [x] Capturar UTMs do `window.location.search` na primeira visita:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
  - extras úteis: `gclid`, `fbclid`, `ref`
- [x] Persistir UTMs (MVP): `localStorage` com timestamp (expirar em 7 dias).
- [x] No submit do form, incluir essas UTMs no payload para `/api/waitlist`.
- [x] Capturar também:
  - `document.referrer`
  - `window.location.pathname` (landing_path)
  - `navigator.userAgent` (opcional — capturado server-side via header)
- [x] Integrar UTMiFy conforme docs (script/tag) para garantir que UTMs sejam registradas no provider também.

**Boas práticas**
- Não confiar só no referrer (muitas vezes vem vazio).
- Expirar UTMs antigas (senão polui attribution).
- Validar tamanho máximo dos campos no server (evita abuso).

---

## 10) LGPD / Legal mínimo (produção)
**Arquivos**
- Criar: `v0-road-saa-s-waitlist-page/app/privacy/page.tsx`
- Atualizar: `v0-road-saa-s-waitlist-page/components/footer.tsx` (link)
- (Opcional) `app/terms/page.tsx`

**Tarefas**
- [x] Criar página de Privacidade:
  - o que coleta (email + utm/referrer)
  - por quê (waitlist)
  - como excluir/descadastrar
  - contato (ex: `contato@roadsaas.com`)
- [x] Linkar no footer.

**Boas práticas**
- Guardar IP apenas como hash (se for guardar).
- Remoção: no MVP, descadastro já resolve; exclusão total pode ser etapa 2.

---

## 11) Observabilidade + qualidade de build (mínimo)
**Arquivos**
- Revisar: `v0-road-saa-s-waitlist-page/next.config.mjs` (hoje ignora erros TS)
- (Opcional) adicionar: Sentry/Log drain depois

**Tarefas**
- [x] Adicionar logs server-side no `POST /api/waitlist`:
  - erro de validação
  - rate limit
  - erro Supabase
  - erro Resend
- [x] (Recomendado) Remover `typescript.ignoreBuildErrors: true` quando estabilizar.
- [x] Rodar:
  - `pnpm lint`
  - `pnpm build`

**Boas práticas**
- Não deployar ignorando TS por muito tempo (vira dívida perigosa).

---

## 12) Checklist final (aceite)
- [x] `POST /api/waitlist` grava no Supabase (dedupe ok)
- [x] rate limit funcionando (429)
- [x] email transacional chegando (Resend)
- [x] link de descadastro funciona e é idempotente
- [x] UTMs/referrer/landing_path gravando no registro
- [x] Páginas de privacidade linkadas
- [x] build/lint passando (ou dívida mapeada)

---

## Rotas (resumo)
- [x] `POST /api/waitlist`
- [x] `POST /api/waitlist/unsubscribe`
- [x] (opcional) `GET /unsubscribe?token=...` (page) que chama a API