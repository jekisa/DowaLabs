import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/motion-primitives";

export function CtaFooter() {
  return (
    <section className="container py-20">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-navy-800 to-navy-900 px-6 py-16 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-[100px]" />
          <h2 className="relative text-3xl font-bold tracking-tight md:text-4xl">
            Siap Buat Foto Produk yang Menjual?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Gabung sekarang dan akses DowaLabs AI Canvas untuk membuat visual
            produk premium dalam hitungan menit.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">Lihat Harga</Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
