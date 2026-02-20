"use client"

import { ScrollReveal } from "./scroll-reveal"
import { motion } from "framer-motion"
import { User, Rocket, Zap } from "lucide-react"

const personas = [
  {
    icon: User,
    title: "Dev solo / Indie hacker",
    description:
      "Você codar você já sabe. Aqui você sai com o plano (docs + prompts) pra shippar sem retrabalho.",
  },
  {
    icon: Rocket,
    title: "Empreendedor não-técnico",
    description:
      "Termo técnico não precisa te travar. Você sai com um plano claro pra executar com no-code ou com dev.",
  },
  {
    icon: Zap,
    title: "Dev experiente",
    description:
      "Você sabe o que precisa — só não quer perder dias montando doc. Aqui é minutos, não dias.",
  },
]

export function PersonaSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl text-balance">
            {"É pra você se…"}
          </h2>
          <p className="mx-auto mb-16 max-w-md text-center text-sm text-muted-foreground">
            Seja qual for seu nível técnico, o RoadSaaS adapta o caminho.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {personas.map((persona, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="flex h-full min-h-[200px] flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(255,107,0,0.08)]"
              >
                {/* Amber top accent */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <persona.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="h-[2px] flex-1 rounded-full bg-accent/20" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {persona.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {persona.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
