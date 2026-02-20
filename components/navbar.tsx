"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RoadSaasLogo } from "./roadsaas-logo"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToWaitlist = () => {
    const el = document.getElementById("cta-waitlist")
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--color-concrete)]/50 bg-[var(--color-asphalt-base)]/90 shadow-[0_1px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <RoadSaasLogo size="small" />
      </motion.div>

      <motion.button
        onClick={scrollToWaitlist}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="relative cursor-pointer overflow-hidden rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--color-safety-orange-hover)]"
      >
        <span className="relative z-10">Quero acesso primeiro</span>
        <motion.span
          className="absolute inset-0 bg-[var(--color-safety-orange-hover)]"
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.nav>
  )
}
