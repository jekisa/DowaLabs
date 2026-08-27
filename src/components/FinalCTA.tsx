"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { PRO_PRICE_LABEL } from "@/components/landing/landing-data";

export function FinalCTA() {
  const { language } = useLanguage();
  const isId = language === "id";
  return (
    <section className="relative isolate overflow-hidden bg-[#080a12] py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_100%_at_50%_100%,rgba(245,185,66,0.18),transparent_72%),radial-gradient(48%_80%_at_78%_0%,rgba(99,102,241,0.15),transparent_72%)]" />
      <div className="absolute inset-0 -z-10 bg-grid-pattern bg-[size:56px_56px] opacity-[0.14] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />
      <div className="container text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-[8px] border border-amber-300/20 bg-amber-300/10 text-amber-300 shadow-[0_0_45px_rgba(245,185,66,0.12)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
          {isId ? "Siap bikin konten produk yang lebih menjual?" : "Ready to make product content that sells harder?"}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          {isId ? "Mulai dengan produk yang sudah kamu punya. DowaLabs membantu membuat presentasinya terlihat lebih premium." : "Start with the products you already have. DowaLabs helps make them look more premium."}
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">
              {isId ? "Daftar Sekarang" : "Sign Up Now"}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-white/15 bg-white/[0.04] hover:bg-white/[0.08] sm:w-auto"
          >
            <Link href="/demo">
              <Play className="h-4 w-4" />
              {isId ? "Lihat Demo" : "Watch Demo"}
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-400">{isId ? `Paket Pro lengkap hanya ${PRO_PRICE_LABEL} untuk 30 hari.` : `The full Pro plan is just ${PRO_PRICE_LABEL} for 30 days.`}</p>
      </div>
    </section>
  );
}
