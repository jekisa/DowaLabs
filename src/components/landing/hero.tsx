"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, PlayCircle, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { BeforeAfterSlider } from "@/components/landing/before-after-slider";
import { heroResults, showcaseCategories, socialProof } from "@/components/landing/landing-data";
import { Button } from "@/components/ui/button";

const heroImage = showcaseCategories[0];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06] bg-[#05060b]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(245,185,66,0.12),transparent_30%,rgba(20,184,166,0.09)_66%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-20" />

      <div className="container relative grid gap-9 py-10 sm:py-12 lg:min-h-[calc(100svh-68px)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1.5 text-xs font-medium text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI Product Photo Studio untuk Seller Indonesia
          </div>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-[3.6rem]">
            Ubah foto produk biasa menjadi visual yang terlihat seperti <span className="text-gradient-gold">Studio Profesional</span> dalam <span className="text-gradient-gold">10 Detik</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
            Upload satu foto. AI otomatis menghapus background, memperbaiki pencahayaan, membuat beberapa variasi premium, dan menghasilkan gambar siap pakai untuk Shopee, TikTok Shop, Instagram, dan marketplace lainnya.
          </p>

          <div className="mt-6 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
            <span className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              ))}
              {socialProof.rating}
            </span>
            <span>{socialProof.generatedImages} gambar dibuat</span>
            <span>{socialProof.activeUsers} seller aktif</span>
            <span>100% tanpa kartu kredit</span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-amber-500/10">
              <Link href="/signup">
                Upload 3 Foto Gratis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#before-after">
                <PlayCircle className="h-4 w-4" /> Lihat Contoh Hasil
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
            {["Gratis 3 gambar", "Tanpa kartu kredit", "Hasil dalam 10 detik"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-amber-300" /> {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] border border-amber-300/10 bg-gradient-to-br from-amber-300/10 via-transparent to-teal-400/10" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11151c]/90 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="grid gap-3 text-center text-xs font-semibold text-slate-300 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <span className="rounded-xl bg-white/[0.05] px-3 py-2">Upload</span>
              <ArrowDown className="mx-auto h-4 w-4 text-amber-300 sm:-rotate-90" />
              <span className="rounded-xl bg-amber-300/10 px-3 py-2 text-amber-200">AI Processing</span>
              <ArrowDown className="mx-auto h-4 w-4 text-amber-300 sm:-rotate-90" />
              <span className="rounded-xl bg-white/[0.05] px-3 py-2">6 Premium Results</span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <BeforeAfterSlider before={heroImage.before} after={heroImage.after} alt={heroImage.alt} priority />
              <div className="grid grid-cols-2 gap-2">
                {heroResults.map((item, index) => (
                  <motion.div
                    key={item.label}
                    animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                    transition={{ duration: 4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-[#090b10] shadow-[0_18px_55px_rgba(0,0,0,0.25)]"
                  >
                    <Image src={item.src} alt={`Hasil AI gaya ${item.label}`} fill sizes="160px" className="object-contain" />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
