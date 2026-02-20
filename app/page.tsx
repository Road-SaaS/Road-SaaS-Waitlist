import { AsphaltBackground } from "@/components/asphalt-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { ComparisonSection } from "@/components/comparison-section"
import { PersonaSection } from "@/components/persona-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

function SectionDivider() {
  return (
    <div className="flex justify-center px-6" aria-hidden="true">
      <div className="h-[1px] w-full max-w-5xl bg-border/30" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AsphaltBackground />
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <ProblemSection />
      <SectionDivider />
      <SolutionSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <ComparisonSection />
      <SectionDivider />
      <PersonaSection />
      <CTASection />
      <Footer />
    </main>
  )
}
