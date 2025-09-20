import FeaturesSection from "@/components/features-four";
import ProblemSection from "@/components/problemSection";
import HeroSection from "@/components/hero-section";
import IntegrationsSection from "@/components/integrations-4";
import { HeroHeader } from "@/components/Header";

export default function Home() {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <IntegrationsSection />
    </>
  );
}
