import FeaturesSection from "@/components/features-four";
import ProblemSection from "@/components/problemSection";
import HeroSection from "@/components/hero-section";
import IntegrationsSection from "@/components/integrations-4";
import { HeroHeader } from "@/components/Header";
import HowItWorkSection from "@/components/HowItWorkSection";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import FAQsSection from "@/components/faqs-4";

export default function Home() {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorkSection />
      <IntegrationsSection />
      <FAQsSection />
      <CallToAction />
      <FooterSection />
    </>
  );
}
