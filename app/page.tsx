import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SourcesGrid } from "@/components/landing/sources-grid";
import { UseCases } from "@/components/landing/use-cases";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <SourcesGrid />
        <UseCases />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
