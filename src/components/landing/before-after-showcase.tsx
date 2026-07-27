"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { BeforeAfterSlider } from "@/components/landing/before-after-slider";
import { showcaseCategories } from "@/components/landing/landing-data";

export function BeforeAfterShowcase() {
  const [activeId, setActiveId] = useState(showcaseCategories[0].id);
  const active = showcaseCategories.find((item) => item.id === activeId) ?? showcaseCategories[0];

  return (
    <section id="before-after" className="section-glow border-b border-white/[0.06] py-12 sm:py-16">
      <div className="container">
        <div className="mb-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-amber-300">
              <Sparkles className="h-3.5 w-3.5" /> Demo utama
            </div>
            <h2 className="mt-2 max-w-2xl text-balance text-2xl font-semibold text-white sm:text-3xl">
              Lihat perubahan dari foto polos ke visual jualan yang lebih niat
            </h2>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Pilih kategori produk, lalu geser slider. Section ini sengaja ditempatkan tepat setelah hero karena visual before/after adalah alasan utama orang percaya hasilnya.
          </p>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {showcaseCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active.id === item.id
                  ? "border-amber-300/30 bg-amber-300/12 text-amber-100"
                  : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.42fr] lg:items-stretch">
          <BeforeAfterSlider before={active.before} after={active.after} alt={active.alt} />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {["Background baru", "Gaya foto berbeda", "Siap untuk posting"].map((item, index) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
              >
                <span className="text-xs font-semibold text-amber-300">0{index + 1}</span>
                <h3 className="mt-2 text-sm font-semibold text-white">{item}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Cocok untuk katalog toko, campaign musiman, dan materi promosi harian.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
