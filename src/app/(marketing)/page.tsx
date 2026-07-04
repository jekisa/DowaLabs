import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";
import { ShowcaseGallery } from "@/components/landing/showcase-gallery";
import { WhatsappHelp } from "@/components/landing/whatsapp-help";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShowcaseGallery />
      <Pricing />
      <Faq />
      <WhatsappHelp number="082298062959" />
    </>
  );
}
