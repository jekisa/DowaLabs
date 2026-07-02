"use client";

import Image from "next/image";
import {
  BadgeDollarSign,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  PlayCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Benefits } from "@/components/landing/benefits";
import { DemoVideo } from "@/components/landing/demo-video";
import { ImagePreviewModal } from "@/components/landing/image-preview-modal";
import { Pricing } from "@/components/landing/pricing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ShowcaseItem = {
  name: string;
  before: string;
  after: string[];
};

const showcaseItems: ShowcaseItem[] = [
  {
    name: "Kacang",
    before: "/images/showcase/kacang-before.jpg",
    after: [
      "/images/showcase/kacang-after1.jpg",
      "/images/showcase/kacang-after2.jpg",
      "/images/showcase/kacang-after3.jpg",
      "/images/showcase/kacang-after4.jpg",
    ],
  },
  {
    name: "Kopi",
    before: "/images/showcase/kopi-before.jpeg",
    after: [
      "/images/showcase/kopi-after1.jpg",
      "/images/showcase/kopi-after2.jpg",
      "/images/showcase/kopi-after3.jpg",
      "/images/showcase/kopi-after4.jpg",
    ],
  },
  {
    name: "Snack",
    before: "/images/showcase/snack-before.jpg",
    after: [
      "/images/showcase/snack-after1.jpg",
      "/images/showcase/snakc-after2.jpg",
      "/images/showcase/snack-after3.jpg",
      "/images/showcase/snack-after4.jpg",
    ],
  },
  {
    name: "Watch",
    before: "/images/showcase/watch-before.jpeg",
    after: [
      "/images/showcase/watch-after1.jpg",
      "/images/showcase/watch-after2.jpg",
      "/images/showcase/watch-after3.jpg",
      "/images/showcase/watch-after4.jpg",
    ],
  },
];

const tshirtAfters = [
  "/images/showcase/tshirt-after1.jpg",
  "/images/showcase/tshirt-after2.jpg",
  "/images/showcase/tshirt-after3.jpg",
  "/images/showcase/tshirt-after4.jpg",
];

const tabItems = [
  { value: "before-after", label: "Before / After", icon: WandSparkles },
  { value: "products", label: "Contoh Produk", icon: ImageIcon },
  { value: "video", label: "Video Demo", icon: PlayCircle },
  { value: "features", label: "Fitur", icon: Boxes },
  { value: "pricing", label: "Harga", icon: BadgeDollarSign },
];

export function ShowcaseGallery() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeProductAfter, setActiveProductAfter] = useState(0);
  const [activeMainAfter, setActiveMainAfter] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const product = showcaseItems[activeProduct];

  const selectProduct = (index: number) => {
    setActiveProduct(index);
    setActiveProductAfter(0);
  };

  return (
    <section id="studio-preview" className="section-glow border-b border-white/[0.06] py-12 sm:py-14">
      <div id="fitur" className="container">
        <div className="mb-7 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
            <Sparkles className="h-3.5 w-3.5" /> Studio preview
          </div>
          <h2 className="mt-2 text-balance text-2xl font-semibold text-white sm:text-3xl">
            1 Foto Awal, Banyak Hasil Siap Posting
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Lihat bagaimana satu foto produk bisa diubah menjadi beberapa visual promosi.
          </p>
        </div>

        <Tabs defaultValue="before-after" className="w-full">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-auto min-w-max justify-start gap-1 rounded-xl border border-white/10 bg-white/[0.035] p-1.5">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 data-[state=active]:bg-amber-300/10 data-[state=active]:text-amber-200 sm:text-sm"
                  >
                    <Icon className="h-3.5 w-3.5" /> {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b0e18]/75 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5">
            <TabsContent value="before-after" className="m-0">
              <div className="mx-auto grid max-w-md grid-cols-2 gap-2.5 sm:gap-4">
                <PreviewImage
                  src="/images/showcase/tshirt-before.jpg"
                  alt="Foto awal T-shirt"
                  label="Foto Awal"
                  className="aspect-[9/16] w-full max-w-[210px] justify-self-center"
                  onOpen={setPreview}
                />
                <PreviewImage
                  src={tshirtAfters[activeMainAfter]}
                  alt="Hasil AI T-shirt"
                  label="Hasil AI"
                  accent
                  className="aspect-[9/16] w-full max-w-[210px] justify-self-center"
                  onOpen={setPreview}
                  onPrevious={() =>
                    setActiveMainAfter((current) => (current - 1 + tshirtAfters.length) % tshirtAfters.length)
                  }
                  onNext={() => setActiveMainAfter((current) => (current + 1) % tshirtAfters.length)}
                  activeIndex={activeMainAfter}
                  slideCount={tshirtAfters.length}
                  onSelect={setActiveMainAfter}
                />
              </div>
            </TabsContent>

            <TabsContent value="products" className="m-0">
              <div className="mb-4 flex flex-wrap gap-2">
                {showcaseItems.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => selectProduct(index)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                      activeProduct === index
                        ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
                        : "border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="mx-auto grid max-w-md grid-cols-2 gap-2.5 sm:gap-4">
                <PreviewImage
                  src={product.before}
                  alt={`Foto awal ${product.name}`}
                  label="Foto Awal"
                  className="aspect-[9/16] w-full max-w-[210px] justify-self-center"
                  onOpen={setPreview}
                />
                <PreviewImage
                  src={product.after[activeProductAfter]}
                  alt={`Hasil AI ${activeProductAfter + 1} untuk ${product.name}`}
                  label="Hasil AI"
                  accent
                  className="aspect-[9/16] w-full max-w-[210px] justify-self-center"
                  onOpen={setPreview}
                  onPrevious={() =>
                    setActiveProductAfter(
                      (current) => (current - 1 + product.after.length) % product.after.length,
                    )
                  }
                  onNext={() => setActiveProductAfter((current) => (current + 1) % product.after.length)}
                  activeIndex={activeProductAfter}
                  slideCount={product.after.length}
                  onSelect={setActiveProductAfter}
                />
              </div>
            </TabsContent>

            <TabsContent value="video" className="m-0">
              <DemoVideo />
            </TabsContent>

            <TabsContent value="features" className="m-0">
              <Benefits />
            </TabsContent>

            <TabsContent value="pricing" className="m-0">
              <Pricing embedded />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ImagePreviewModal src={preview} onClose={() => setPreview(null)} />
    </section>
  );
}

function PreviewImage({
  src,
  alt,
  label,
  accent,
  className,
  onOpen,
  onPrevious,
  onNext,
  activeIndex,
  slideCount,
  onSelect,
}: {
  src: string;
  alt: string;
  label?: string;
  accent?: boolean;
  className: string;
  onOpen: (src: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  activeIndex?: number;
  slideCount?: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] ${className}`}>
      <button type="button" onClick={() => onOpen(src)} className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={src}
            className="absolute inset-0 block"
            initial={{ opacity: 0, x: 8, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.985 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 44vw, 210px"
              className="object-contain"
            />
          </motion.span>
        </AnimatePresence>
        <span className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/65 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
        </span>
      </button>
      {label && (
        <span
          className={`pointer-events-none absolute left-2.5 top-2.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${
            accent
              ? "border-amber-300/20 bg-black/65 text-amber-200"
              : "border-white/10 bg-black/65 text-slate-200"
          }`}
        >
          {label}
        </span>
      )}

      {onPrevious && onNext && slideCount && activeIndex !== undefined && onSelect && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Gambar sebelumnya"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-white backdrop-blur-md transition hover:bg-black/85"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Gambar berikutnya"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-white backdrop-blur-md transition hover:bg-black/85"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/55 px-2.5 py-1.5 backdrop-blur-md">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Tampilkan gambar ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === index ? "w-4 bg-amber-300" : "w-1.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
