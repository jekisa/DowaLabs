"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "Rp19.000",
    daily: "sekitar Rp633/hari",
    href: "/signup?plan=basic",
    cta: "Pilih Basic",
    description: "Untuk mulai membangun katalog produk yang lebih rapi.",
    features: ["Akses DowaLabs Canvas", "Prompt dasar", "Tutorial penggunaan"],
  },
  {
    name: "Pro",
    price: "Rp35.000",
    daily: "sekitar Rp1.167/hari",
    href: "/signup?plan=pro",
    cta: "Mulai dengan Pro",
    description: "Untuk affiliate yang ingin produksi konten lebih konsisten.",
    recommended: true,
    features: [
      "Semua fitur Basic",
      "Prompt premium",
      "Template affiliate",
      "Prioritas update",
    ],
  },
];

export function Pricing() {
  return (
    <section id="harga" className="relative overflow-hidden border-y border-white/[0.06] bg-[#070810] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_45%,rgba(245,185,66,0.09),transparent_78%),radial-gradient(45%_45%_at_78%_22%,rgba(99,102,241,0.08),transparent_78%)]" />
      <div className="container relative">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="eyebrow">Harga membership</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            Investasi kecil untuk visual yang terlihat lebih bernilai
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Pilih paket sesuai ritme produksi konten. Upgrade kapan saja saat kebutuhan bertambah.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl items-stretch gap-4 md:grid-cols-2 md:gap-5">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[8px] p-6 sm:p-8",
                plan.recommended
                  ? "border border-amber-300/35 bg-[linear-gradient(155deg,rgba(245,185,66,0.14),rgba(13,15,25,0.94)_42%)] shadow-[0_28px_90px_rgba(180,113,20,0.16)] md:-translate-y-3"
                  : "glass-panel"
              )}
            >
              {plan.recommended && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] text-amber-300">
                  {plan.recommended ? <Crown className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                </div>
                {plan.recommended && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-bold uppercase text-[#130d04] sm:text-xs">
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    Paling direkomendasikan
                  </div>
                )}
              </div>

              <div className="mt-7">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">{plan.description}</p>
              </div>

              <div className="mt-6 border-y border-white/[0.08] py-6">
                <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                  <span className="text-4xl font-semibold text-white sm:text-5xl">{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-400">/ bulan</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{plan.daily}</p>
              </div>

              <ul className="mt-6 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300/10 text-amber-300">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "mt-8 w-full",
                  !plan.recommended && "border border-white/15 bg-white/[0.06] text-white shadow-none hover:bg-white/10"
                )}
                size="lg"
              >
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-6 text-slate-500">
          Setelah pembayaran terverifikasi, akses membership tersedia melalui dashboard DowaLabs.
        </p>
      </div>
    </section>
  );
}
