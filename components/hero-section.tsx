"use client"

import { TypewriterText } from "./typewriter-text"
import { WaitlistForm } from "./waitlist-form"
import { WaitlistCount } from "./waitlist-count"
import { motion } from "framer-motion"
import { ChevronDown, Construction } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="animate-pulse-glow mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
      >
        <Construction className="h-3.5 w-3.5" strokeWidth={2} />
        <span>Beta em construção. Lista aberta.</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-6 text-center font-serif text-5xl font-bold leading-tight tracking-[-0.02em] text-foreground md:text-7xl lg:text-8xl"
      >
        <span className="block text-balance">Pare de improvisar.</span>
        <span className="block text-primary">
          <TypewriterText text="Planeje seu SaaS." delay={65} />
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10 max-w-2xl text-center text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
      >
        Você tem a ideia. <span className="font-medium text-foreground/90">Quando o RoadSaaS abrir</span>, em menos de 1 hora você sai com{" "}
        <span className="font-medium text-foreground/90">
          PRD, SRS, ADR e um roadmap acionável
        </span>{" "}
        — adaptado ao seu nível técnico.
        <span className="block" />
        Sem “lixo bonito”. Sem retrabalho.
      </motion.p>

      {/* Waitlist form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8"
      >
        <WaitlistForm id="hero-waitlist" formId="waitlist-form" showHelperText />
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="mb-16 flex items-center justify-center"
      >
        <WaitlistCount />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
            deslize
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
