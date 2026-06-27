import { ImageIcon } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/motion-primitives";

const EXAMPLES = [
  "Fashion & Mukena",
  "Skincare & Kosmetik",
  "Parfum",
  "Produk Digital",
  "Makanan & Minuman",
  "Aksesoris",
];

export function ProductExamples() {
  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Contoh Hasil"
        title="Cocok untuk Berbagai Produk"
        description="DowaLabs dipakai seller dan affiliate untuk beragam kategori produk."
      />

      <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {EXAMPLES.map((label) => (
          <StaggerItem key={label}>
            <div className="glass group relative aspect-square overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity group-hover:opacity-100 opacity-60" />
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="px-2 text-sm font-medium">{label}</span>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
