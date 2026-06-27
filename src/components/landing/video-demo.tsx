import { PlayCircle } from "lucide-react";
import { FadeIn } from "@/components/motion/motion-primitives";
import { SectionHeading } from "@/components/landing/section-heading";

export function VideoDemo() {
  return (
    <section id="demo" className="container py-20">
      <SectionHeading
        eyebrow="Demo"
        title="Lihat DowaLabs Bekerja"
        description="Tonton bagaimana foto produk biasa berubah menjadi visual premium yang siap jual."
      />
      <FadeIn className="mx-auto mt-10 max-w-4xl">
        <div className="glass relative aspect-video overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10" />
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-gold-400 transition-transform hover:scale-105">
              <PlayCircle className="h-10 w-10" />
            </span>
            <p className="text-sm text-muted-foreground">
              Placeholder video — embed YouTube/Vimeo atau file MP4 produk kamu.
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
