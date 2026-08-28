"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language";

const copy = {
  id: {
    eyebrow: "AI CREATIVE WORKSPACE",
    title: "Satu workspace untuk seluruh kebutuhan visual.",
    body: "Buat visual produk, hapus background, atur warna, buat portrait, dan akses ribuan prompt AI dalam satu membership.",
    tags: ["Product Studio", "Background Remover", "5.000+ Prompt AI"],
    labels: ["Product Studio", "Marketplace", "Lifestyle", "Portrait", "Kemasan"],
  },
  en: {
    eyebrow: "AI CREATIVE WORKSPACE",
    title: "One workspace for every visual you need.",
    body: "Create product visuals, remove backgrounds, grade colors, build portraits, and reach thousands of AI prompts in a single membership.",
    tags: ["Product Studio", "Background Remover", "5,000+ AI Prompts"],
    labels: ["Product Studio", "Marketplace", "Lifestyle", "Portrait", "Packaging"],
  },
};

// Five images, not four: the old set left the bottom-right cell of the 2-column
// grid empty because the featured tile spans both columns. objectPosition is
// per-image because every source is a 768x1376 portrait — object-center cropped
// straight through the models' faces in these short tiles.
const images = [
  { src: "/images/showcase/snack-after1.jpg", objectPosition: "object-center" },
  { src: "/images/showcase/tshirt-after1.jpg", objectPosition: "object-[50%_25%]" },
  { src: "/images/showcase/tumbler-after1.jpg", objectPosition: "object-[50%_28%]" },
  { src: "/images/showcase/Character_5.jpg", objectPosition: "object-[50%_22%]" },
  { src: "/images/showcase/kopi-after2.jpg", objectPosition: "object-center" },
];

export function AuthShowcase() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#fdfaf4] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="relative z-10 flex h-full flex-col">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-amber-600">{text.eyebrow}</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{text.title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{text.body}</p>
        <div className="mt-6 grid flex-1 grid-cols-2 gap-3">
          {images.map((image, index) => (
            <ShowcaseImage
              key={image.src}
              label={text.labels[index]}
              src={image.src}
              objectPosition={image.objectPosition}
              featured={index === 0}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-700">
          {text.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-2">{tag}</span>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

function ShowcaseImage({ label, src, objectPosition, featured = false }: { label: string; src: string; objectPosition: string; featured?: boolean }) {
  return (
    <div className={`relative min-h-32 overflow-hidden rounded-xl border border-white bg-white shadow-sm ${featured ? "col-span-2 min-h-44" : ""}`}>
      <Image
        src={src}
        alt={label}
        fill
        sizes="(max-width: 1024px) 45vw, 22vw"
        priority={featured}
        className={`object-cover ${objectPosition} transition duration-300 hover:scale-[1.02]`}
      />
    </div>
  );
}
