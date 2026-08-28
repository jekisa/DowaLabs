import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { Pricing } from "@/components/Pricing";
import { LocalizedTitle } from "@/components/localized-title";

export const metadata: Metadata = { title: "Harga" };

export default function PricingPage() {
  return (
    <div>
      <LocalizedTitle id="Harga" en="Pricing" />
      <Pricing />
      <FinalCTA />
    </div>
  );
}
