"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AuthShowcase() {
  const images = [
    ["Product Studio", "/images/showcase/powcan_tumbler.jpg"],
    ["Marketplace", "/images/showcase/tshirt-after1.jpg"],
    ["Lifestyle", "/images/showcase/tumbler-after1.jpg"],
    ["Portrait", "/images/showcase/Character_5.jpg"],
  ];

  return (
    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="relative z-10 flex h-full flex-col">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-amber-600">AI CREATIVE WORKSPACE</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Satu workspace untuk seluruh kebutuhan visual.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Buat visual produk, hapus background, atur warna, buat portrait, dan akses ribuan prompt AI dalam satu membership.</p>
        <div className="mt-6 grid flex-1 grid-cols-2 gap-3">
          <ShowcaseImage label={images[0][0]} src={images[0][1]} featured />
          {images.slice(1).map(([label, src]) => <ShowcaseImage key={label} label={label} src={src} />)}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-700">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Product Studio</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Background Remover</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2">5.000+ Prompt AI</span>
        </div>
      </div>
    </motion.aside>
  );
}

function ShowcaseImage({ label, src, featured = false }: { label: string; src: string; featured?: boolean }) {
  return <div className={`relative min-h-32 overflow-hidden rounded-xl border border-white bg-white shadow-sm ${featured ? "col-span-2 min-h-44" : ""}`}><Image src={src} alt={label} fill sizes="(max-width: 1024px) 45vw, 22vw" className="object-cover transition duration-300 hover:scale-[1.02]" /></div>;
}
