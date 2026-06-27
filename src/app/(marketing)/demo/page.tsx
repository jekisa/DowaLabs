import type { Metadata } from "next";
import { BeforeAfter } from "@/components/BeforeAfter";
import { DemoVideo } from "@/components/DemoVideo";
import { FeatureCards } from "@/components/FeatureCards";
import { FinalCTA } from "@/components/FinalCTA";

export const metadata: Metadata = { title: "Demo" };

export default function DemoPage() {
  return (
    <div>
      <DemoVideo />
      <BeforeAfter />
      <FeatureCards />
      <FinalCTA />
    </div>
  );
}
