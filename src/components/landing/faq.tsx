"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/components/landing/landing-data";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#05060b] py-12 sm:py-16">
      <div className="container grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Pertanyaan utama sebelum mulai</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Informasi singkat tentang produk, pembayaran, akses, dan risk reversal.
          </p>
          <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
            <ShieldCheck className="mb-2 h-5 w-5 text-emerald-200" />
            Jika pembayaran berhasil tapi akses belum aktif, support akan bantu pengecekan sampai akses aktif atau transaksi ditindaklanjuti.
          </div>
        </div>

        <div className="space-y-2.5">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium text-white"
                >
                  {item.question}
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-amber-300 transition-transform", isOpen && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-4 pb-4 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
