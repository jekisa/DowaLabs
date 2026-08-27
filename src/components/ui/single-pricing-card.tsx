"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SinglePricingCardProps {
  language: "id" | "en";
  /** the 3 objection-handling lines rendered under the CTA */
  trustPoints?: string[];
  className?: string;
}

const features = [
  ["Product Studio", "Product Studio"],
  ["Background Remover", "Background Remover"],
  ["Color Grading", "Color Grading"],
  ["Portrait Style", "Portrait Style"],
  ["5.000+ Prompt AI", "5,000+ AI Prompts"],
  ["Akses seluruh fitur baru selama membership aktif", "Access to new features while membership is active"],
];

export function SinglePricingCard({ language, trustPoints = [], className }: SinglePricingCardProps) {
  const isId = language === "id";
  return (
    <div className={cn("mx-auto w-full max-w-[860px]", className)}>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }} className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
        <div className="relative rounded-[22px] bg-white">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold uppercase tracking-[0.28em] text-amber-600 sm:text-base">{isId ? "PAKET DOWALABS" : "DOWALABS PLAN"}</span>
              {/* the shared warning variant is amber-400 on a 15% tint - fine on
                  the dark dashboard, ~1.9:1 on this cream card. */}
              <Badge variant="warning" className="border-amber-300 bg-amber-100 text-amber-800">Pro</Badge>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{isId ? "Satu Paket. Semua Tool." : "One Plan. Every Tool."}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{isId ? "Tidak perlu memilih paket rumit. Satu langganan membuka seluruh creative suite DowaLabs." : "No complicated plans. One subscription unlocks the complete DowaLabs creative suite."}</p>

            <div className="my-5 border-y border-slate-200 py-5">
              <div className="flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-3">
                <span className="text-sm font-medium text-slate-400 line-through">Rp200.000</span>
                <span className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">Rp99.000</span>
                <span className="text-sm font-medium text-slate-500 sm:pb-2">{isId ? "untuk 30 hari" : "for 30 days"}</span>
              </div>
              <p className="mt-3 text-sm text-amber-700">{isId ? "Semua fitur premium dalam satu langganan." : "Every premium feature in one subscription."}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {features.map(([id, en]) => <div key={id} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><Check className="mt-1 shrink-0 text-amber-600" size={17} />{isId ? id : en}</div>)}
            </div>

            <Button asChild size="lg" className="mt-7 h-14 w-full text-base font-semibold transition hover:-translate-y-0.5"><Link href="/signup">{isId ? "Mulai Sekarang — Rp99.000" : "Start Now — Rp99.000"}</Link></Button>
            <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
              {trustPoints.map((point) => (
                <p key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><ShieldCheck className="mt-0.5 shrink-0 text-teal-700" size={18} />{point}</p>
              ))}
              <p className="pl-[30px] text-xs text-slate-500">{isId ? "Akses aktif selama 30 hari setelah pembayaran berhasil." : "Access stays active for 30 days after successful payment."}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
