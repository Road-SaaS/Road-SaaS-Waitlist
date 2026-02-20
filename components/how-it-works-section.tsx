"use client"

import { ScrollReveal } from "./scroll-reveal"
import { motion } from "framer-motion"
import { MessageSquare, Target, FileDown, Rocket } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: "Conta sua ideia",
    description:
      "Você responde perguntas curtas (problema, público, contexto).",
  },
  {
    number: 2,
    icon: Target,
    title: "Define seu MVP",
    description:
      "A gente te guia pra escopar o menor produto possível que entrega valor real.",
  },
  {
    number: 3,
    icon: FileDown,
    title: "Gera seus docs (quando abrir)",
    description:
      "PRD, SRS, ADR e prompts pro Cursor — tudo em Markdown.",
  },
  {
    number: 4,
    icon: Rocket,
    title: "Você constrói com direção",
    description:
      "Com o plano na mão, a IA para de chutar. E você para de retrabalhar.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="mb-5 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl text-balance">
            Como funciona
          </h2>
          <p className="mx-auto mb-20 max-w-md text-center text-sm text-muted-foreground">
            4 passos. Menos de 1 hora. Plano completo.
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical road line */}
          <div
            className="absolute top-0 bottom-0 left-[23px] w-[2px] md:left-[27px]"
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, var(--color-concrete) 0, var(--color-concrete) 8px, transparent 8px, transparent 16px)",
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          <div className="flex flex-col gap-10">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <motion.div
                  className="flex gap-6 md:gap-8"
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  {/* Number badge */}
                  <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-[0_0_16px_rgba(255,107,0,0.2)]">
                    <step.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 rounded-lg border border-transparent p-1 transition-colors">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-primary/60">
                        Passo {String(step.number).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mb-1 font-serif text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
