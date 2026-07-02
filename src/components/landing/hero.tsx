"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ImagePreviewModal } from "@/components/landing/image-preview-modal";
import { Button } from "@/components/ui/button";

type HeroStackImage = {
  src: string;
  alt: string;
  label: string;
};

const heroStackImages: HeroStackImage[] = [
  {
    src: "/images/showcase/kopi-after1.jpg",
    alt: "Hasil AI produk kopi dengan pencahayaan studio",
    label: "Coffee campaign",
  },
  {
    src: "/images/showcase/kopi-after2.jpg",
    alt: "Hasil AI produk kopi dengan nuansa premium",
    label: "Premium coffee",
  },
  {
    src: "/images/showcase/snack-after1.jpg",
    alt: "Hasil AI produk snack untuk konten promosi",
    label: "Snack campaign",
  },
  {
    src: "/images/showcase/snakc-after2.jpg",
    alt: "Hasil AI produk snack dengan komposisi kreatif",
    label: "Creative snack",
  },
  {
    src: "/images/showcase/watch-after1.jpg",
    alt: "Hasil AI jam tangan bergaya mewah",
    label: "Luxury watch",
  },
  {
    src: "/images/showcase/watch-after2.jpg",
    alt: "Hasil AI jam tangan untuk iklan produk",
    label: "Watch campaign",
  },
  {
    src: "/images/showcase/tshirt-after1.jpg",
    alt: "Hasil AI kaus untuk konten marketplace",
    label: "T-shirt studio",
  },
  {
    src: "/images/showcase/tshirt-after2.jpg",
    alt: "Hasil AI kaus dengan gaya editorial",
    label: "T-shirt editorial",
  },
  {
    src: "/images/showcase/tshirt-after3.jpg",
    alt: "Hasil AI kaus untuk campaign sosial media",
    label: "Social campaign",
  },
  {
    src: "/images/showcase/tshirt-after4.jpg",
    alt: "Hasil AI kaus dengan tampilan premium",
    label: "Premium apparel",
  },
];

const trustPoints = [
  "Tanpa skill desain",
  "Bisa untuk affiliate",
  "Siap untuk konten harian",
];

const stackPositions = [
  { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 30 },
  { x: 30, y: -10, rotate: 4, scale: 0.96, zIndex: 20 },
  { x: -28, y: 14, rotate: -5, scale: 0.92, zIndex: 10 },
] as const;

export function Hero() {
  const [images, setImages] = useState<HeroStackImage[]>(() => [...heroStackImages]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setImages((current) => {
      const shuffled = [...current];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const target = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
      }

      return shuffled;
    });
  }, []);

  const showPrevious = () => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const selectImage = (index: number) => {
    setDirection(index >= activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const visibleCards = [0, 1, 2].map((offset) => ({
    image: images[(activeIndex + offset) % images.length],
    slot: offset,
  }));

  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06] bg-[#05060b]">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-25" />
      <div className="pointer-events-none absolute left-[18%] top-0 h-80 w-80 rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[12%] top-12 h-80 w-80 rounded-full bg-indigo-500/10 blur-[130px]" />

      <div className="container relative grid gap-7 py-9 sm:py-11 lg:min-h-[calc(100svh-68px)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1.5 text-xs font-medium text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI Product Studio untuk Seller &amp; Affiliate
          </div>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
            Ubah Foto Produk Biasa Jadi <span className="text-gradient-gold">Konten Siap Jual</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
            DowaLabs membantu seller, affiliate, dan UMKM membuat visual produk yang lebih menarik untuk marketplace, sosial media, dan promosi dari foto biasa.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-amber-500/10">
              <Link href="/signup">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#studio-preview">
                <PlayCircle className="h-4 w-4" /> Lihat Demo
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-xs text-slate-400">
                <Check className="h-3.5 w-3.5 text-amber-300" /> {point}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e18]/90 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300/10 text-amber-300">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Contoh hasil AI</p>
                  <p className="text-[10px] text-slate-500">1 foto bisa jadi banyak konten</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-medium text-emerald-200">
                Live preview
              </span>
            </div>

            <div className="relative h-[22rem] overflow-hidden sm:h-[27rem]">
              <div className="pointer-events-none absolute inset-x-[20%] top-[24%] h-48 rounded-full bg-indigo-500/15 blur-3xl" />
              <AnimatePresence initial={false} custom={direction}>
                {visibleCards.map(({ image, slot }) => {
                  const position = stackPositions[slot];

                  return (
                    <motion.div
                      key={image.src}
                      custom={direction}
                      initial={{
                        opacity: 0,
                        x: position.x + direction * 36,
                        y: position.y + 8,
                        rotate: position.rotate + direction * 2,
                        scale: position.scale * 0.94,
                      }}
                      animate={{
                        opacity: 1,
                        x: position.x,
                        y: position.y,
                        rotate: position.rotate,
                        scale: position.scale,
                      }}
                      exit={{
                        opacity: 0,
                        x: -direction * 48,
                        y: 10,
                        scale: 0.92,
                      }}
                      transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.85 }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      style={{ zIndex: position.zIndex }}
                    >
                      <button
                        type="button"
                        onClick={() => setPreview(image.src)}
                        aria-label={`Buka preview ${image.label}`}
                        className="pointer-events-auto group relative aspect-[9/16] w-[10.75rem] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.5)] outline-none transition hover:border-amber-300/25 focus-visible:ring-2 focus-visible:ring-amber-300 sm:w-[13.5rem] sm:p-2"
                      >
                        <span className="relative block h-full w-full overflow-hidden rounded-xl bg-[#070911]">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            priority={slot === 0}
                            sizes="(max-width: 640px) 172px, 216px"
                            className="object-contain transition duration-500 group-hover:scale-[1.025]"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent px-3 pb-3 pt-12 text-left text-[10px] font-medium text-white sm:text-xs">
                            {image.label}
                          </span>
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Hasil AI sebelumnya"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex min-w-0 items-center justify-center gap-1.5">
                  {images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => selectImage(index)}
                      aria-label={`Tampilkan hasil ${index + 1}`}
                      aria-current={activeIndex === index ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        activeIndex === index
                          ? "w-5 bg-amber-300"
                          : "w-1.5 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Hasil AI berikutnya"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-500">
                Klik kartu untuk melihat gambar penuh
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-300/10 via-transparent to-indigo-500/10 blur-2xl" />
        </motion.div>
      </div>

      <ImagePreviewModal src={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
