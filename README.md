# RoadSaaS — Waitlist

Landing page de waitlist para o **RoadSaaS**, uma plataforma que ajuda devs solo e empreendedores a planejar seus produtos SaaS de forma estruturada.

## Sobre

O RoadSaaS gera em menos de 1 hora: PRD, SRS, ADRs e um roadmap acionavel — tudo adaptado ao nivel tecnico do usuario.

Esta aplicacao e a pagina de captura de leads para o pre-lancamento.

## Stack principal

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **Framer Motion** para animacoes

## Rodando localmente

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

O app estara disponivel em `http://localhost:3000`.

## Estrutura

```
v0-road-saa-s-waitlist-page/
├── app/           # App Router (layout, page, globals)
├── components/    # Secoes da landing page + ui/
├── hooks/         # Custom hooks
├── lib/           # Utilitarios
├── public/        # Assets estaticos
└── docs/          # Documentacao do projeto
```

## Documentacao

- [`docs/context.md`](docs/context.md) — Contexto do projeto
- [`docs/architecture.md`](docs/architecture.md) — Arquitetura da aplicacao
- [`docs/stack.md`](docs/stack.md) — Tecnologias utilizadas

## Autor

Feito por **Jose Hernane** — [roadsaas.com](https://roadsaas.com)
