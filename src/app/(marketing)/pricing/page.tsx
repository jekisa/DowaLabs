import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { Pricing } from "@/components/Pricing";

export const metadata: Metadata = { title: "Harga" };

export default function PricingPage() {
  return (
    <div>
      <Pricing />
      <FinalCTA />
    </div>
  );
}
