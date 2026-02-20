"use client"

import { ScrollReveal } from "./scroll-reveal"
import { motion } from "framer-motion"
import { ShieldCheck, FileText, Cpu } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Validação antes do código",
    description:
      "Antes de se apaixonar pela solução, valida se o problema existe e pra quem.",
    accent: "var(--color-road-green)",
  },
  {
    icon: FileText,
    title: "Docs que viram execução",
    description:
      "PRD, SRS e ADR em minutos — prontos pra virar backlog e prompt bom no Cursor.",
    accent: "var(--color-safety-orange)",
  },
  {
    icon: Cpu,
    title: "Caminho técnico pro seu nível",
    description:
      "Stack e ferramentas recomendadas pro seu contexto, do no-code ao dev avançado.",
    accent: "var(--color-amber)",
  },
]

export function SolutionSection() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      {/* Subtle vertical road marking */}
      <div
        className="pointer-events-none absolute inset-0 flex justify-center"
        aria-hidden="true"
      >
        <div
          className="h-full w-[2px] opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--color-off-white) 0, var(--color-off-white) 20px, transparent 20px, transparent 40px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl text-balance">
            O RoadSaaS é o mapa.
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-sm text-muted-foreground">
            3 pilares pra você sair do zero com direção.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group flex h-full min-h-[200px] flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(255,107,0,0.08)]"
              >
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-300"
                  style={{ backgroundColor: `color-mix(in srgb, ${feature.accent} 12%, transparent)` }}
                >
                  <feature.icon
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: feature.accent }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
