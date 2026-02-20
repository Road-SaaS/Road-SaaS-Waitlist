"use client"

import Link from "next/link"
import { RoadSaasLogo } from "./roadsaas-logo"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Logo */}
        <RoadSaasLogo size="small" />

        {/* Tagline */}
        <p className="text-center text-sm text-muted-foreground">
          O caminho mais curto entre sua ideia e seu MVP.
        </p>

        {/* Links */}
        <div className="flex items-center gap-5">
          <motion.a
            href="https://x.com/RoadSaaS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Twitter / X"
            whileHover={{ y: -2 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.a>
          <span className="text-sm text-muted-foreground/60">
            Feito por José Hernane (build in public)
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 text-xs text-muted-foreground/40">
        <Link
          href="/privacy"
          className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Politica de Privacidade
        </Link>
        <span>{"© 2026 RoadSaaS"}</span>
      </div>
    </footer>
  )
}
