import { SectionHeading } from "@/components/landing/section-heading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="container py-20">
      <SectionHeading
        eyebrow="Cara Kerja"
        title="Mulai dalam 5 Langkah Mudah"
        description="Tidak ribet. Daftar, bayar, dan langsung buat foto produk yang menjual."
      />

      <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {HOW_IT_WORKS.map((item) => (
          <StaggerItem key={item.step}>
            <div className="glass h-full rounded-xl p-6">
              <span className="text-3xl font-bold text-gradient-gold">
                {item.step}
              </span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
