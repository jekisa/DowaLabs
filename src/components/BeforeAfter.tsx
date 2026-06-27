"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Camera, WandSparkles } from "lucide-react";

export function BeforeAfter() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#070810] py-20 sm:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Before &amp; after</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
              Perbedaan visual yang langsung terasa
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            Produk yang sama, dipresentasikan dengan lighting, background, dan komposisi yang lebih kuat.
          </p>
        </div>

        <motion.div
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-3 lg:grid-cols-[1fr_48px_1fr]"
        >
          <VisualCard label="Foto Biasa" badge="RAW UPLOAD" icon={Camera} muted />
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/[0.08] text-amber-300 shadow-[0_0_30px_rgba(245,185,66,0.12)]">
            <ArrowDown className="h-5 w-5 lg:-rotate-90" />
          </div>
          <VisualCard label="Foto Siap Jual" badge="AI ENHANCED" icon={WandSparkles} />
        </motion.div>
      </div>
    </section>
  );
}

function VisualCard({
  label,
  badge,
  icon: Icon,
  muted,
}: {
  label: string;
  badge: string;
  icon: typeof Camera;
  muted?: boolean;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-[8px] p-2 sm:p-3">
      <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden rounded-[8px] bg-[#0a0c13]">
        <Image
          src="/images/dowalabs-product-studio.png"
          alt={muted ? "Foto produk sebelum diproses" : "Foto produk premium siap jual"}
          fill
          sizes="(max-width: 1024px) 94vw, 550px"
          className={muted ? "object-cover grayscale brightness-[0.48] contrast-75" : "object-cover"}
        />
        <div
          className={
            muted
              ? "absolute inset-0 bg-slate-950/35"
              : "absolute inset-0 bg-gradient-to-t from-[#05060b]/65 via-transparent to-transparent"
          }
        />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-[8px] border border-white/10 bg-black/45 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
          <Icon className={muted ? "h-4 w-4 text-slate-300" : "h-4 w-4 text-amber-300"} />
          {badge}
        </div>
        {!muted && (
          <div className="absolute bottom-4 right-4 rounded-[8px] border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-200 backdrop-blur-md">
            Ready to publish
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-4">
        <p className="font-medium text-white">{label}</p>
        <span className="text-xs text-slate-500">{muted ? "Tanpa treatment" : "Premium output"}</span>
      </div>
    </div>
  );
}
