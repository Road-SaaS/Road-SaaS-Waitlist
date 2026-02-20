# Arquitetura

## Visao geral

A aplicacao e uma **single-page landing site** construida com Next.js 16 (App Router) e React 19. Segue o modelo de composicao por secoes, onde cada secao da pagina e um componente isolado.

## Estrutura de diretorios

```
v0-road-saa-s-waitlist-page/
├── app/                    # App Router (Next.js)
│   ├── layout.tsx          # Layout raiz (fonts, metadata, analytics)
│   ├── page.tsx            # Pagina principal (composicao das secoes)
│   └── globals.css         # Tokens de design e animacoes globais
├── components/             # Componentes da aplicacao
│   ├── ui/                 # Biblioteca shadcn/ui (40+ componentes base)
│   ├── hero-section.tsx
│   ├── problem-section.tsx
│   ├── solution-section.tsx
│   ├── how-it-works-section.tsx
│   ├── comparison-section.tsx
│   ├── persona-section.tsx
│   ├── cta-section.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── waitlist-form.tsx
│   ├── roadsaas-logo.tsx      # Logo SVG com variantes de tamanho
│   ├── scroll-reveal.tsx
│   ├── typewriter-text.tsx
│   ├── count-up.tsx
│   └── asphalt-background.tsx
├── hooks/                  # Custom hooks
│   ├── use-mobile.ts       # Deteccao de breakpoint mobile
│   └── use-toast.ts        # Hook de notificacoes toast
├── lib/
│   └── utils.ts            # Funcoes utilitarias (cn)
├── public/                 # Assets estaticos (icones, logo, placeholders)
└── styles/
    └── globals.css         # Estilos compartilhados
```

## Fluxo da pagina

A `page.tsx` monta a pagina compondo as secoes na seguinte ordem, separadas por um componente `SectionDivider` (linha horizontal sutil):

```
Navbar (fixo no topo)
  └── Hero Section (headline + waitlist form)
  ── SectionDivider ──
  └── Problem Section (timeline do problema)
  ── SectionDivider ──
  └── Solution Section (3 features)
  ── SectionDivider ──
  └── How It Works Section (4 passos)
  ── SectionDivider ──
  └── Comparison Section (com vs sem RoadSaaS)
  ── SectionDivider ──
  └── Persona Section (3 personas)
  └── CTA Section (formulario final)
  └── Footer
```

## Padroes de componentes

- **Server vs Client Components**: componentes interativos usam a diretiva `"use client"`. O layout raiz e server-side.
- **Animacoes**: Framer Motion com `whileInView` para animacoes scroll-triggered. O componente `ScrollReveal` encapsula esse padrao.
- **Formulario**: `WaitlistForm` aparece em duas secoes (Hero e CTA). Atualmente simula a chamada de API com `setTimeout` — nao ha backend conectado.
- **Background**: `AsphaltBackground` renderiza noise procedural via Canvas API com animacao baseada em tempo.
- **Logo**: `RoadSaasLogo` e um componente SVG inline com variantes de tamanho (`small`, `default`, `large`), usando as CSS variables do design system.
- **SectionDivider**: componente local em `page.tsx` que renderiza uma linha horizontal sutil entre secoes para separacao visual.

## Design System

O tema segue a metafora de **estrada/asfalto** com a seguinte paleta:

| Token | Cor | Uso |
|-------|-----|-----|
| `asphalt-base` | `#121212` | Background principal |
| `asphalt-surface` | `#1C1C1C` | Superficies elevadas |
| `safety-orange` | `#FF6B00` | Cor primaria / CTAs |
| `road-green` | `#22C55E` | Estados de sucesso |
| `signal-red` | `#EF4444` | Estados de erro |
| `off-white` | `#E5E5E5` | Texto principal |
| `concrete` | `#404040` | Bordas |

**Tipografia:**
- Display: Space Grotesk
- Body: Inter
- Code: JetBrains Mono

## Responsividade

Abordagem mobile-first com breakpoints Tailwind (`sm:`, `md:`, `lg:`). Elementos como a linha de timeline do Problem Section sao ocultados em telas menores.
