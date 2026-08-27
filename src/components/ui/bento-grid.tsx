"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BentoCardItem {
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  /** object-position class. Defaults to object-top: every photo here is a
      portrait, and centring one in a landscape card cuts the head off. */
  imagePosition?: string;
  href?: string;
  className?: string;
}

interface BentoGridProps {
  items: BentoCardItem[];
  ctaLabel: string;
  className?: string;
}

export function BentoGrid({ items, ctaLabel, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-6", className)}>
      {items.map((item) => (
        <BentoCard key={item.title} item={item} ctaLabel={ctaLabel} />
      ))}
    </div>
  );
}

function BentoCard({ item, ctaLabel }: { item: BentoCardItem; ctaLabel: string }) {
  const Icon = item.icon;
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.08)]", item.className)}
    >
      {/* the photo box is flex-1, i.e. exactly the card minus the copy panel.
          Letting the image fill the whole card put up to 67% of it behind the
          opaque panel, and in a narrow column (1024) that also flipped cover to
          height-driven scaling - no vertical overflow left, so object-position
          stopped working and the head sat under the panel. */}
      <div className="relative flex-1 overflow-hidden">
        {item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className={cn("object-cover opacity-90 transition duration-300 group-hover:scale-[1.025]", item.imagePosition ?? "object-top")} /> : null}
        {/* faint veil so the icon row stays readable over any photo */}
        <div className="absolute inset-0 bg-white/10" />
        <div className="relative z-10 flex items-start justify-between gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition duration-300 group-hover:rotate-3">
            <Icon size={21} strokeWidth={1.8} />
          </span>
          <ArrowUpRight className="text-slate-400 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-600" size={20} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
      </div>
      <div className="relative bg-white px-5 pb-5 pt-4">
        <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{item.description}</p>
        <Link href={item.href || "/signup"} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition duration-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
          {ctaLabel}
          <ArrowUpRight className="text-amber-600 transition-transform duration-200 group-hover:translate-x-[3px]" size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
