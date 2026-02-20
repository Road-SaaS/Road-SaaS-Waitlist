"use client"

import { ScrollReveal } from "./scroll-reveal"
import { motion } from "framer-motion"
import { Lightbulb, Bot, Code2, Skull } from "lucide-react"

const steps = [
  { icon: Lightbulb, label: "Ideia empolgante", broken: false },
  { icon: Bot, label: "Prompt solto no GPT", broken: false },
  { icon: Code2, label: "Abre o Cursor e começa a codar", broken: false },
  {
    icon: Skull,
    label: "Duas semanas depois: retrabalho e um MVP que ninguém pediu",
    broken: true,
  },
]

export function ProblemSection() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl text-balance">
            Você conhece esse ciclo?
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-sm text-muted-foreground">
            A maioria dos fundadores solo passa por isso. Repetidamente.
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-4">
          {/* Dashed road line (desktop) */}
          <div
            className="absolute top-12 right-8 left-8 hidden h-[2px] md:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--color-concrete) 0, var(--color-concrete) 12px, transparent 12px, transparent 24px)",
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={`relative flex h-full min-h-[160px] flex-col rounded-lg border bg-card p-5 transition-all duration-300 ${
                  step.broken
                    ? "border-destructive/40 hover:border-destructive/60 hover:shadow-[0_4px_24px_rgba(239,68,68,0.1)]"
                    : "border-border hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(255,107,0,0.08)]"
                }`}
              >
                {/* Step indicator */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      step.broken
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                    }`}
                  >
                    <step.icon
                      className={`h-5 w-5 ${
                        step.broken ? "text-destructive" : "text-primary"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium leading-relaxed ${
                    step.broken ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mx-auto mt-12 flex max-w-2xl items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-5 py-4">
            <div className="h-8 w-[3px] flex-shrink-0 rounded-full bg-primary" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              A IA não é o problema. <span className="font-medium text-foreground/90">O problema é o mapa.</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
