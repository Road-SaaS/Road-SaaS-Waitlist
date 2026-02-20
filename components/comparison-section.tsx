"use client"

import { ScrollReveal } from "./scroll-reveal"
import { motion } from "framer-motion"
import { X, Check, Quote } from "lucide-react"

const without = [
  "Começa a codar sem validar mercado",
  "Gasta semanas em feature que ninguém pediu",
  "Decide arquitetura no chute",
  "Chega no mês 2 sem saber por que parou",
]

const withRoad = [
  "Valida a ideia antes de escrever código",
  "MVP definido com escopo cirúrgico",
  "Docs que a IA realmente entende",
  "Sai do dia 1 com direção clara",
]

export function ComparisonSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl text-balance">
            Com vs sem RoadSaaS
          </h2>
          <p className="mx-auto mb-16 max-w-md text-center text-sm text-muted-foreground">
            A diferença entre improvisar e planejar.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Without */}
          <ScrollReveal delay={0}>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="flex h-full min-h-[280px] flex-col rounded-lg border border-destructive/20 bg-card p-6 transition-all duration-300 hover:border-destructive/40 hover:shadow-[0_4px_24px_rgba(239,68,68,0.06)]"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <X className="h-5 w-5 text-destructive" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Sem RoadSaaS
                </h3>
              </div>
              <ul className="flex flex-col gap-4">
                {without.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive/50" strokeWidth={1.5} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>

          {/* With */}
          <ScrollReveal delay={0.1}>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="flex h-full min-h-[280px] flex-col rounded-lg border border-[var(--color-road-green)]/20 bg-card p-6 transition-all duration-300 hover:border-[var(--color-road-green)]/40 hover:shadow-[0_4px_24px_rgba(34,197,94,0.06)]"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-road-green)]/10">
                  <Check className="h-5 w-5 text-[var(--color-road-green)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Com RoadSaaS
                </h3>
              </div>
              <ul className="flex flex-col gap-4">
                {withRoad.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-road-green)]/70" strokeWidth={1.5} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Pullquote */}
        <ScrollReveal delay={0.3}>
          <blockquote className="relative mt-16 rounded-lg border border-border/50 bg-card/50 px-8 py-6 text-center">
            <Quote
              className="absolute top-4 left-4 h-5 w-5 text-primary/20"
              strokeWidth={1.5}
            />
            <p className="font-serif text-lg font-semibold leading-relaxed text-foreground md:text-xl">
              {
                "O GPT é uma Ferrari. O RoadSaaS é o GPS. Sem GPS, até a Ferrari te leva pro lugar errado."
              }
            </p>
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  )
}
