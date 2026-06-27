import { BeforeAfter } from "@/components/BeforeAfter";
import { DemoVideo } from "@/components/DemoVideo";
import { FAQ } from "@/components/FAQ";
import { FeatureCards } from "@/components/FeatureCards";
import { FinalCTA } from "@/components/FinalCTA";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { InlineCTA } from "@/components/InlineCTA";
import { Pricing } from "@/components/Pricing";
import { TrustSection } from "@/components/TrustSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DemoVideo />
      <BeforeAfter />
      <FeatureCards />
      <InlineCTA />
      <HowItWorks />
      <Pricing />
      <TrustSection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
