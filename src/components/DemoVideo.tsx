"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, WandSparkles } from "lucide-react";

export function DemoVideo() {
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/demo.mp4", { method: "HEAD" })
      .then((response) => {
        if (active && response.ok) setVideoReady(true);
      })
      .catch(() => {
        // The visual fallback is already rendered while the demo file is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

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

        <motion.div
          initial={{ y: 28 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel mx-auto max-w-5xl overflow-hidden rounded-[8px] p-2 sm:p-3"
        >
          <div className="flex h-10 items-center justify-between border-b border-white/[0.08] px-2 sm:px-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <WandSparkles className="h-3.5 w-3.5 text-amber-300" />
              Product Studio walkthrough
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-slate-400">
              01:24
            </span>
          </div>

          <div className="relative mt-2 aspect-video min-h-[230px] overflow-hidden rounded-[8px] bg-[#090c17] sm:mt-3">
            {videoReady ? (
              <video
                className="h-full w-full object-cover"
                src="/demo.mp4"
                controls
                preload="metadata"
                onError={() => setVideoReady(false)}
              />
            ) : (
              <>
                <Image
                  src="/images/dowalabs-product-studio.png"
                  alt="Preview demo DowaLabs Canvas"
                  fill
                  sizes="(max-width: 1024px) 94vw, 960px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#05060b]/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060b]/80 via-transparent to-[#05060b]/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-200/40 bg-amber-300/15 text-amber-100 shadow-[0_0_45px_rgba(245,185,66,0.22)] backdrop-blur-md sm:h-20 sm:w-20"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                    </motion.div>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs text-slate-100 backdrop-blur-md sm:text-sm">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      Preview DowaLabs Canvas
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
