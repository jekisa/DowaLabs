"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export type ShowcaseVideo = {
  src: string;
  title: string;
  description?: string;
};

type VideoShowcaseCarouselProps = {
  videos: readonly ShowcaseVideo[];
  title?: string;
  description?: string;
};

function getRelativePosition(index: number, activeIndex: number, total: number) {
  if (index === activeIndex) return 0;
  return (index - activeIndex + total) % total === 1 ? 1 : -1;
}

export function VideoShowcaseCarousel({
  videos,
  title = "Contoh Hasil Prompt Video",
  description = "Lihat contoh video vertikal dari prompt DowaLabs untuk konten affiliate dan promosi produk.",
}: VideoShowcaseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  if (videos.length === 0) return null;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + videos.length) % videos.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % videos.length);
  };

  return (
    <section aria-labelledby="video-showcase-title" className="mx-auto max-w-5xl">
      <div className="mb-3 text-center sm:mb-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
          <PlayCircle className="h-3.5 w-3.5" /> Video prompt
        </div>
        <h3 id="video-showcase-title" className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
          {description}
        </p>
      </div>

      <div className="relative mx-auto h-[23rem] max-w-3xl overflow-hidden [--video-stack-offset:4.25rem] sm:h-[25rem] sm:[--video-stack-offset:9.5rem] lg:h-[27rem] lg:[--video-stack-offset:11.5rem]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl sm:h-72 sm:w-72" />

        {videos.map((video, index) => {
          const position = getRelativePosition(index, activeIndex, videos.length);
          const isActive = position === 0;
          const x =
            position === 0
              ? "0px"
              : position < 0
                ? "calc(0px - var(--video-stack-offset))"
                : "var(--video-stack-offset)";

          return (
            <div
              key={video.src}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: isActive ? 30 : 10 }}
              aria-hidden={!isActive}
            >
              <motion.article
                animate={{
                  x,
                  y: isActive ? 0 : 10,
                  rotate: position * 6,
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.6,
                }}
                whileHover={isActive ? { scale: 1.03, y: -3 } : undefined}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 190, damping: 24, mass: 0.9 }
                }
                className={`relative aspect-[9/16] w-[12.25rem] rounded-[2.25rem] border p-2 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:w-[13.5rem] lg:w-[14.5rem] ${
                  isActive
                    ? "pointer-events-auto border-white/20 bg-gradient-to-b from-[#262a36] to-[#090b11]"
                    : "border-white/10 bg-[#10131d]"
                }`}
              >
                <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-black/70 bg-black">
                  <video
                    src={video.src}
                    className="absolute inset-0 h-full w-full bg-black object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />

                  <div className="pointer-events-none absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full border border-white/[0.06] bg-black/90 shadow-lg" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent px-4 pb-4 pt-16">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0 text-left">
                        <p className="truncate text-[11px] font-semibold text-white sm:text-xs">
                          {video.title}
                        </p>
                        {video.description && (
                          <p className="mt-1 truncate text-[9px] text-slate-400 sm:text-[10px]">
                            {video.description}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-amber-300/15 text-amber-200 backdrop-blur-md">
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          );
        })}
      </div>

      <div className="mx-auto -mt-1 flex w-fit items-center gap-4 rounded-full border border-white/[0.08] bg-black/25 px-2.5 py-2 shadow-lg backdrop-blur-md sm:mt-0">
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Video sebelumnya"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center gap-2">
          {videos.map((video, index) => (
            <button
              key={video.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Tampilkan ${video.title}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                activeIndex === index ? "w-7 bg-amber-300" : "w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={showNext}
          aria-label="Video berikutnya"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
