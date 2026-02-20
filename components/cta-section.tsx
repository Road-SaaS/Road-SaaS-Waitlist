"use client"

import { ScrollReveal } from "./scroll-reveal"
import { WaitlistForm } from "./waitlist-form"
import { motion } from "framer-motion"
import { Lock, Mail, CreditCard } from "lucide-react"

const trustSignals = [
  { icon: Lock, text: "Sem spam. Nunca." },
  { icon: Mail, text: "Um email quando abrir. Só." },
  { icon: CreditCard, text: "Sem cartão de crédito pra entrar na lista." },
]

export function CTASection() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      {/* Surface background */}
      <div className="absolute inset-0 bg-card" aria-hidden="true" />
      {/* Safety orange glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(255,107,0,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Não quer virar mais um projeto abandonado?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mb-10 text-base text-muted-foreground">
            Entra na lista e recebe acesso primeiro quando o beta abrir.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex justify-center">
            <WaitlistForm id="cta-waitlist" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            {trustSignals.map((signal, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <signal.icon className="h-3.5 w-3.5 text-primary/60" strokeWidth={1.5} />
                <span>{signal.text}</span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
