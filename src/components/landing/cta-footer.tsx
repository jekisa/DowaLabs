import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/motion-primitives";

export function CtaFooter() {
  return (
    <section className="border-t border-white/[0.06] bg-[#05060b] py-12 sm:py-14">
      <div className="container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-[linear-gradient(135deg,rgba(245,185,66,0.14),rgba(11,14,24,0.92)_42%,rgba(20,184,166,0.1))] px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:42px_42px] opacity-20" />
            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-amber-200">
                  <Sparkles className="h-3.5 w-3.5" /> DowaLabs Pro
                </div>
                <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Jangan biarkan foto produk biasa mengurangi penjualanmu.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  Mulai gratis hari ini. Upload 3 foto, lihat hasil AI, dan pakai visual terbaik untuk konten jualanmu.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-300">
                  {["Akses instan", "Prompt siap pakai", "Tool visual produk"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-amber-300" /> {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg" className="shadow-lg shadow-amber-500/10">
                  <Link href="/signup">
                  Upload 3 Foto Gratis Sekarang <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#pricing">Lihat Harga</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
