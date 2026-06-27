import {
  Briefcase,
  Clock,
  Layers,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { BENEFITS } from "@/lib/constants";

const ICONS = [Sparkles, Wand2, Briefcase, Clock, Layers, ShieldCheck];

export function Benefits() {
  return (
    <section id="fitur" className="container py-20">
      <SectionHeading
        eyebrow="Benefit"
        title="Kenapa Memilih DowaLabs?"
        description="Tidak perlu desain dari nol. DowaLabs membantu kamu membuat tampilan produk lebih profesional, cocok untuk seller, affiliate, dan UMKM."
      />

      <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <StaggerItem key={benefit.title}>
              <div className="glass h-full rounded-xl p-6 transition-colors hover:border-primary/30">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-gold-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.desc}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
