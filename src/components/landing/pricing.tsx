"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { pricingTiers, valueStack } from "@/components/landing/landing-data";
import { Button } from "@/components/ui/button";

export function Pricing({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.78fr] lg:items-start">
      <div className="grid gap-4 md:grid-cols-2">
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            className={`relative overflow-hidden rounded-2xl border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ${
              tier.featured
                ? "border-amber-300/30 bg-gradient-to-br from-amber-300/[0.12] via-white/[0.045] to-teal-400/[0.07]"
                : "border-white/10 bg-white/[0.035]"
            }`}
          >
            {tier.featured && (
              <div className="absolute right-4 top-4 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-200">
                Paling worth it
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{tier.description}</p>
            <div className="mt-5 flex items-end gap-2">
              <div>
                {"originalPrice" in tier && tier.originalPrice && (
                  <p className="text-sm font-medium text-slate-500 line-through">{tier.originalPrice}</p>
                )}
                <p className="text-3xl font-semibold text-white">{tier.price}</p>
              </div>
              <span className="pb-1 text-sm text-slate-400">{tier.period}</span>
            </div>
            <Button asChild size="lg" className="mt-5 w-full" variant={tier.featured ? "default" : "outline"}>
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
            <ul className="mt-5 space-y-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm leading-5 text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <aside className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-3.5 w-3.5" /> Value stack
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">Bandingkan dengan biaya produksi manual</h3>
        <div className="mt-5 space-y-3">
          {valueStack.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/15 px-4 py-3">
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-right text-sm font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Asumsi value stack dibuat sebagai anchor harga agar visitor memahami biaya alternatif sebelum memilih paket.
        </p>
      </aside>
    </div>
  );

  if (embedded) return content;

  return (
    <section id="pricing" className="border-b border-white/[0.06] bg-[#05060b] py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="eyebrow">Harga</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Mulai kecil, upgrade saat konten produk makin rutin
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Dua pilihan paket memberi anchor yang lebih jelas: coba kebutuhan dasar, atau langsung pakai workflow Pro.
          </p>
        </div>
        {content}
      </div>
    </section>
  );
}
