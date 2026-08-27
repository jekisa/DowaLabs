"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Clapperboard, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialProofCardsProps {
  language: "id" | "en";
  className?: string;
}

const cards: Array<{ title: string; icon: LucideIcon; id: string; en: string }> = [
  { title: "Seller & UMKM", icon: ShoppingBag, id: "Buat visual produk lebih siap jual tanpa harus menyiapkan studio foto untuk setiap konten.", en: "Create sales-ready product visuals without setting up a photo studio for every piece of content." },
  { title: "Content Creator", icon: Clapperboard, id: "Percepat pembuatan variasi visual untuk campaign, sosial media, dan kebutuhan konten harian.", en: "Produce visual variations faster for campaigns, social media, and daily content." },
  { title: "Brand & Marketing", icon: BriefcaseBusiness, id: "Jaga tampilan visual lebih konsisten untuk katalog, promosi, dan materi marketing.", en: "Keep visual output more consistent across catalogs, promotions, and marketing materials." },
];

export function SocialProofCards({ language, className }: SocialProofCardsProps) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.article key={card.title} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.06 }} className="group rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition group-hover:bg-amber-100"><Icon size={21} strokeWidth={1.8} /></div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{language === "id" ? card.id : card.en}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
