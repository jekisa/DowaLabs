"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, WandSparkles } from "lucide-react";

type DemoClip = {
  title: string;
  duration: string;
  src: string;
  cover: string;
};

const DEMO_CLIPS: DemoClip[] = [
  {
    title: "Product Studio",
    duration: "00:18",
    src: "/videos/demo-1.mp4",
    cover: "/images/showcase/kacang-after1.jpg",
  },
  {
    title: "Lifestyle Campaign",
    duration: "00:12",
    src: "/videos/demo-2.mp4",
    cover: "/images/showcase/tshirt-after3.jpg",
  },
  {
    title: "Background & Color",
    duration: "00:10",
    src: "/videos/demo-3.mp4",
    cover: "/images/showcase/kopi-after1.jpg",
  },
];

export function DemoVideo() {
  return (
    <section id="demo" className="section-glow relative overflow-hidden py-20 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="eyebrow">Lihat cara kerjanya</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            Satu workflow untuk visual produk yang siap dipasarkan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Upload produk, tentukan gaya, lalu hasilkan materi visual yang konsisten untuk campaign affiliate.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-3">
          {DEMO_CLIPS.map((clip, index) => (
            <DemoClipCard key={clip.src} clip={clip} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoClipCard({ clip, index }: { clip: DemoClip; index: number }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handlePlay() {
    setPlaying(true);
    // Tunggu video ter-render lalu putar.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        // Autoplay bisa diblokir browser; user tetap bisa pakai kontrol.
      });
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="glass-panel group w-full max-w-[300px] overflow-hidden rounded-[18px] p-2"
    >
      <div className="flex h-9 items-center justify-between px-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <WandSparkles className="h-3.5 w-3.5 text-amber-300" />
          {clip.title}
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">
          {clip.duration}
        </span>
      </div>

      <div className="relative mt-1.5 aspect-[9/16] overflow-hidden rounded-[14px] bg-[#090c17]">
        {playing ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={clip.src}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Putar ${clip.title}`}
            className="absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Image
              src={clip.cover}
              alt={`Cover ${clip.title}`}
              fill
              sizes="(max-width: 640px) 90vw, 300px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060b]/85 via-[#05060b]/10 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-amber-200/40 bg-amber-300/20 text-amber-50 shadow-[0_0_45px_rgba(245,185,66,0.25)] backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-black">
              <Play className="ml-1 h-7 w-7 fill-current" />
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
