"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Images, Sparkles } from "lucide-react";

export type PokerCardImage = {
  src: string;
  alt: string;
  label?: string;
};

type PokerCardGalleryProps = {
  images: readonly PokerCardImage[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

const cardRotations = [-18, -9, 0, 9, 18] as const;
const cardArc = [24, 8, 0, 8, 24] as const;
const cardOffsets = [
  "calc(0px - var(--card-spread) - var(--card-spread))",
  "calc(0px - var(--card-spread))",
  "0px",
  "var(--card-spread)",
  "calc(var(--card-spread) + var(--card-spread))",
] as const;
const cardLayerClasses = [
  "z-10 hover:z-[80]",
  "z-20 hover:z-[80]",
  "z-40 hover:z-[80]",
  "z-20 hover:z-[80]",
  "z-10 hover:z-[80]",
] as const;

export function PokerCardGallery({
  images,
  eyebrow = "Galeri inspirasi",
  title = "Lima visual, satu produk yang sama",
  description = "Lihat bagaimana satu foto sederhana berubah menjadi rangkaian visual premium yang siap dipakai untuk campaign.",
}: PokerCardGalleryProps) {
  const reduceMotion = useReducedMotion();
  const cards = images.slice(0, 5);

  if (cards.length !== 5) {
    return null;
  }

  return (
    <section
      id="galeri"
      aria-labelledby="poker-gallery-title"
      className="relative isolate overflow-hidden border-b border-white/[0.06] py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 -z-20 bg-[#05060b]" />
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-5xl bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.16),transparent_68%)] blur-2xl" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/[0.07] blur-3xl sm:h-72 sm:w-72" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h2
            id="poker-gallery-title"
            className="mt-4 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
            {description}
          </p>
        </div>

        <ul
          aria-label="Galeri hasil visual produk"
          className="relative mx-auto mt-10 h-[15.5rem] max-w-5xl [--card-spread:clamp(2.75rem,13vw,4rem)] [--card-width:clamp(8rem,36vw,10rem)] sm:mt-14 sm:h-[20rem] sm:[--card-spread:6.5rem] sm:[--card-width:12rem] lg:h-[23rem] lg:[--card-spread:9rem] lg:[--card-width:14rem]"
        >
          {cards.map((image, index) => {
            const offset = index - 2;
            const y = cardArc[index];

            return (
              <li
                key={`${image.src}-${index}`}
                className={`absolute left-1/2 top-0 w-[var(--card-width)] -translate-x-1/2 ${cardLayerClasses[index]}`}
              >
                <motion.div
                  className="[transform-origin:50%_100%]"
                  initial={
                    reduceMotion
                      ? false
                      : { x: 0, y: 30, rotate: 0, scale: 0.94, opacity: 0.35 }
                  }
                  whileInView={{
                    x: cardOffsets[index],
                    y,
                    rotate: cardRotations[index],
                    scale: 1,
                    opacity: 1,
                  }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.9,
                    delay: reduceMotion ? 0 : Math.abs(offset) * 0.055,
                    type: "spring",
                    stiffness: 95,
                    damping: 17,
                    mass: 0.9,
                  }}
                >
                  <motion.div
                    className="group relative aspect-[4/5] overflow-hidden rounded-[18px] border border-white/15 bg-[#0b0e18] p-1.5 shadow-[0_26px_70px_rgba(0,0,0,0.48)] ring-1 ring-black/30 sm:rounded-[22px] sm:p-2"
                    whileHover={reduceMotion ? undefined : { y: -16, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  >
                    <div className="relative h-full overflow-hidden rounded-[13px] bg-slate-950 sm:rounded-[16px]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 639px) 40vw, (max-width: 1023px) 192px, 224px"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-white/[0.06]" />
                      <span className="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-black/35 text-[10px] font-semibold text-white backdrop-blur-md sm:left-3 sm:top-3 sm:h-8 sm:w-8 sm:text-xs">
                        0{index + 1}
                      </span>
                      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                        <p className="line-clamp-2 text-[10px] font-medium leading-4 text-white sm:text-xs">
                          {image.label ?? `Visual ${index + 1}`}
                        </p>
                        {index === 2 && (
                          <span className="hidden shrink-0 rounded-full border border-amber-200/20 bg-amber-300/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-amber-100 sm:inline-flex">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-500 sm:mt-0 sm:text-xs">
          <Images className="h-3.5 w-3.5 text-indigo-300" />
          Sentuh atau arahkan cursor ke kartu untuk melihat detail
        </div>
      </div>
    </section>
  );
}
