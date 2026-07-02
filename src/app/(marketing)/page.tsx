import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";
import { ShowcaseGallery } from "@/components/landing/showcase-gallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShowcaseGallery />
      <Pricing />
      <Faq />
    </>
  );
}
