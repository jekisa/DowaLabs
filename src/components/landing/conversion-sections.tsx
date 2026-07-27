"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Bot, Check, PlayCircle, Sparkles, X } from "lucide-react";
import {
  comparisonRows,
  featureCards,
  showcaseCategories,
  socialProof,
} from "@/components/landing/landing-data";

export function MarketplaceLogos() {
  return (
    <section className="border-b border-white/[0.06] bg-[#090b10] py-7">
      <div className="container">
        <p className="text-center text-xs font-medium uppercase tracking-normal text-slate-500">
          Trusted by sellers on
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {socialProof.logos.map((logo) => (
            <div
              key={logo}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center text-sm font-semibold text-slate-300 shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoDemoSection() {
  return (
    <section id="demo" className="border-b border-white/[0.06] bg-[#05060b] py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Video demo</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Lihat AI bekerja dalam 30 detik
          </h2>
        </div>
        <motion.div
          whileHover={{ y: -4 }}
          className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(246,183,43,0.14),rgba(17,21,28,0.94))] shadow-[0_30px_100px_rgba(0,0,0,0.36)]"
        >
          <div className="relative aspect-video">
            <video className="h-full w-full object-cover opacity-70" src="/videos/demo-1.mp4" muted loop playsInline />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-300 text-black shadow-[0_0_45px_rgba(246,183,43,0.45)]">
                <PlayCircle className="h-8 w-8" />
              </span>
              <p className="mt-4 text-sm font-medium text-white">30-second product demo card</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function CategoryGallery() {
  return (
    <section id="gallery" className="border-b border-white/[0.06] bg-[#090b10] py-12 sm:py-16">
      <div className="container">
        <div className="mb-7 max-w-2xl">
          <p className="eyebrow">Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Contoh hasil untuk berbagai kategori produk
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseCategories.slice(0, 6).map((item) => (
            <motion.article
              key={item.id}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <GalleryImage src={item.before} alt={`Before ${item.label}`} />
                <ArrowDown className="-rotate-90 text-amber-300" />
                <GalleryImage src={item.after} alt={`After ${item.label}`} />
              </div>
              <h3 className="mt-3 px-1 text-sm font-semibold text-white">{item.label}</h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#0b0e18]">
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 45vw, 180px" className="object-contain" />
    </div>
  );
}

export function ProblemSolution() {
  const bad = ["Background berantakan", "Pencahayaan jelek", "Kurang profesional", "CTR rendah", "Produk sepi"];
  const good = ["Background premium", "Lighting realistis", "Komposisi lebih menarik", "CTR naik", "Visual siap jual"];

  return (
    <section className="border-b border-white/[0.06] bg-[#05060b] py-12 sm:py-16">
      <div className="container grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <ProblemCard title="Masih upload foto seperti ini?" items={bad} negative />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-amber-300 shadow-[0_0_55px_rgba(246,183,43,0.35)]">
          <Bot className="h-8 w-8" />
        </div>
        <ProblemCard title="AI memperbaiki semuanya" items={good} />
      </div>
    </section>
  );
}

function ProblemCard({ title, items, negative = false }: { title: string; items: string[]; negative?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
            {negative ? <X className="h-4 w-4 text-red-300" /> : <Check className="h-4 w-4 text-amber-300" />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeaturesGrid() {
  return (
    <section id="features" className="border-b border-white/[0.06] bg-[#090b10] py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="eyebrow">Features</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Semua yang dibutuhkan untuk visual marketplace
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <motion.article
              key={feature}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
            >
              <Sparkles className="h-5 w-5 text-amber-300" />
              <h3 className="mt-4 text-base font-semibold text-white">{feature}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Optimasi otomatis untuk membuat produk terlihat lebih bersih, jelas, dan siap digunakan di banyak channel.
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ComparisonTable() {
  return (
    <section className="border-b border-white/[0.06] bg-[#05060b] py-12 sm:py-16">
      <div className="container">
        <div className="mb-7 max-w-2xl">
          <p className="eyebrow">Comparison</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">DowaLabs vs cara lama</h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                {["", "Studio Photo", "Photoshop", "Designer", "DowaLabs"].map((head) => (
                  <th key={head} className="px-4 py-4 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-white/10 last:border-b-0">
                  <td className="px-4 py-4 font-semibold text-white">{row.label}</td>
                  <td className="px-4 py-4 text-slate-400">{row.studio}</td>
                  <td className="px-4 py-4 text-slate-400">{row.photoshop}</td>
                  <td className="px-4 py-4 text-slate-400">{row.designer}</td>
                  <td className="px-4 py-4 font-semibold text-amber-200">{row.dowa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
