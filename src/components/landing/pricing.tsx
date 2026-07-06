"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Akses semua tool DowaLabs Canvas",
  "5.000 prompt produk siap pakai",
  "Template affiliate premium",
  "Tutorial penggunaan",
  "Prioritas update",
];

export function Pricing({ embedded = false }: { embedded?: boolean }) {
  const card = (
    <div className="mx-auto grid max-w-4xl gap-5 rounded-2xl border border-amber-300/25 bg-gradient-to-br from-amber-300/[0.09] via-white/[0.035] to-indigo-500/[0.07] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
          <Sparkles className="h-3 w-3" /> Paket Pro
        </div>
        <div className="mt-4 flex items-end gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-500 line-through">Rp60.000</span>
            <span className="text-3xl font-semibold text-white sm:text-4xl">Rp29.900</span>
          </div>
          <span className="pb-1 text-sm text-slate-400">/ bulan</span>
          <span className="mb-1 ml-1 inline-flex items-center rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">50% OFF</span>
        </div>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
          Satu paket lengkap untuk membuat visual produk affiliate yang lebih siap jual.
        </p>
        <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
          <Link href="/signup">Mulai dengan Pro</Link>
        </Button>
      </div>

      <ul className="grid gap-2.5 rounded-xl border border-white/10 bg-black/15 p-4 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-xs leading-5 text-slate-300 sm:text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );

  if (embedded) {
    return card;
  }

  return (
    <section id="pricing" className="border-y border-white/[0.06] bg-[#070810] py-12 sm:py-14">
      <div className="container">
        <div className="mx-auto mb-7 max-w-2xl text-center">
          <p className="eyebrow">Harga sederhana</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Semua tool dalam satu paket</h2>
        </div>
        {card}
      </div>
    </section>
  );
}
