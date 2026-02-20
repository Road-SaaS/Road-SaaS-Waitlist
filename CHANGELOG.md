# Changelog

## [Unreleased] — Melhorias da landing waitlist (plano 2026-02-20)

### Adicionado

- **Formulário no hero e CTA:** Três campos visíveis (Nome, Email, Nível de experiência) + botão "Quero acesso primeiro 🚀". Layout: desktop com nome e email lado a lado; select e botão em largura total; mobile empilhado.
- **Campo `experience_level` no backend:** Migration `002_add_experience_level.sql` adiciona coluna opcional na tabela `waitlist_signups`. API `POST /api/waitlist` aceita e persiste `experience_level` (nullable).
- **Endpoint `GET /api/waitlist/count`:** Retorna `{ count: number }` (inscritos com `status = 'subscribed'`), com cache curto (s-maxage=60).
- **Contador condicional no hero:** Componente `WaitlistCount`: se count < 10 exibe "Primeiros fundadores já estão entrando na lista."; se ≥ 10 exibe número dinâmico com `CountUp` + " fundadores solo já entraram na lista. Entra também."
- **Página Termos de Uso:** `app/terms/page.tsx` com conteúdo mínimo e link no footer.
- **Metadata e Open Graph:** Em `app/layout.tsx`, descrição atualizada e objeto `openGraph` (title, description, url, siteName, locale pt_BR, type website).

### Alterado

- **WaitlistForm:** Substituído formulário de um campo (email) por formulário com nome (min 2 caracteres), email e select de nível técnico. Estilos: inputs/select `bg-[#1C1C1C]`, `border-[#404040]`, `focus:border-[#FF6B00]`, `focus:ring-2 focus:ring-[#FF6B00]`; botão `bg-[#FF6B00]`, `hover:bg-[#E65D00]`.
- **Estados do formulário:** Loading (campos e botão desabilitados, texto "Entrando na lista..." + spinner). Sucesso: mensagem única "✅ Você está na lista! Vamos te avisar quando abrir." em #22C55E. Erro: "Ops, algo deu errado. Tenta de novo?" abaixo do botão em #EF4444. Email duplicado tratado como sucesso (mesma mensagem).
- **Validação client-side:** Campos inválidos com borda #EF4444; nome min 2 caracteres, email válido, nível obrigatório.
- **Hero:** Container do formulário com `formId="waitlist-form"` para scroll; bloco de prova social substituído por `WaitlistCount`.
- **Navbar:** Botão CTA faz scroll suave para `#waitlist-form` (formulário do hero) em vez de `#cta-waitlist`.
- **Footer:** "Politica de Privacidade" → "Política de Privacidade"; adicionado link "Termos de Uso" para `/terms` separado por " | ".
- **Acessibilidade:** Labels associados aos campos (sr-only), `aria-label="Inscrever na lista de espera"` no botão, primeira opção do select desabilitada como placeholder, focus ring nos controles.
- **Respiro visual:** Aumento de padding vertical e margens nas seções "Como funciona" e "O RoadSaaS é o mapa" (py-28 md:py-36, mb-20).

### Arquivos criados

- `supabase/migrations/002_add_experience_level.sql`
- `app/api/waitlist/count/route.ts`
- `app/terms/page.tsx`
- `components/waitlist-count.tsx`
- `CHANGELOG.md`

### Arquivos modificados

- `app/api/waitlist/route.ts` — schema Zod + insert com `experience_level`
- `app/layout.tsx` — metadata + openGraph
- `components/waitlist-form.tsx` — formulário completo, estados, validação, acessibilidade
- `components/hero-section.tsx` — formId, WaitlistCount
- `components/cta-section.tsx` — (usa WaitlistForm atualizado, sem alteração de copy)
- `components/navbar.tsx` — scroll para waitlist-form
- `components/footer.tsx` — Política de Privacidade + link Termos
- `components/how-it-works-section.tsx` — respiro visual
- `components/solution-section.tsx` — respiro visual
