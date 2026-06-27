import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div>
      <FAQ />
      <FinalCTA />
    </div>
  );
}
