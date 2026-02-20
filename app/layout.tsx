import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'RoadSaaS — Waitlist | O caminho mais curto entre sua ideia e seu MVP',
  description:
    'Pare de improvisar. Entre na waitlist do RoadSaaS e receba acesso primeiro ao beta. Em menos de 1 hora, você sai com PRD, SRS, ADR e um roadmap acionável — adaptado ao seu nível técnico.',
  icons: {
    icon: '/roadsaas-avatar-v3.png',
    apple: '/roadsaas-avatar-v3.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#121212',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
        {/* UTMiFy — captura UTMs no provider (criar conta em utmify.com.br) */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
