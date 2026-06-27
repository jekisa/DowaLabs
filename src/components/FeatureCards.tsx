"use client";

import { motion } from "framer-motion";
import {
  Brush,
  Eraser,
  ImagePlus,
  Layers3,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "AI Product Photo",
    desc: "Buat visual produk dengan gaya studio, marketplace, atau campaign.",
    icon: ImagePlus,
    accent: "text-amber-300 bg-amber-300/10",
  },
  {
    title: "Background Remover",
    desc: "Bersihkan latar foto produk agar siap masuk ke berbagai materi promosi.",
    icon: Eraser,
    accent: "text-cyan-300 bg-cyan-300/10",
  },
  {
    title: "Ganti Background",
    desc: "Ubah suasana produk menjadi premium tanpa perlu melakukan foto ulang.",
    icon: Layers3,
    accent: "text-violet-300 bg-violet-300/10",
  },
  {
    title: "Filter Foto Premium",
    desc: "Tambahkan lighting dan tone profesional agar katalog terlihat konsisten.",
    icon: Brush,
    accent: "text-rose-300 bg-rose-300/10",
  },
  {
    title: "Prompt Affiliate Siap Pakai",
    desc: "Mulai lebih cepat dengan prompt untuk konten jualan dan marketplace.",
    icon: MessageSquareText,
    accent: "text-blue-300 bg-blue-300/10",
  },
  {
    title: "Akses Google Canvas",
    desc: "Masuk ke DowaLabs AI Canvas langsung melalui dashboard membership.",
    icon: Sparkles,
    accent: "text-emerald-300 bg-emerald-300/10",
  },
];

export function FeatureCards() {
  return (
    <section id="fitur" className="section-glow relative py-20 sm:py-24">
      <div className="container">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="eyebrow">Toolkit kreatif</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            Dari foto mentah sampai materi affiliate dalam satu tempat
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Fokus pada konten dan penjualan. DowaLabs menangani workflow visual yang berulang.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group glass rounded-[8px] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.06] sm:p-6"
              >
                <div className={"mb-8 flex h-11 w-11 items-center justify-center rounded-[8px] " + feature.accent}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.desc}</p>
                <div className="mt-6 h-px w-10 bg-white/10 transition-all duration-300 group-hover:w-20 group-hover:bg-amber-300/40" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
