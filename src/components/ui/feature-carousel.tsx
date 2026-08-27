"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCarouselItem {
  src: string;
  alt: string;
  label: string;
}

interface FeatureCarouselProps {
  items: FeatureCarouselItem[];
  className?: string;
}

export function FeatureCarousel({ items, className }: FeatureCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % items.length), 4000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const move = (direction: 1 | -1) => setActive((index) => (index + direction + items.length) % items.length);

  return (
    <div className={cn("relative mx-auto w-full max-w-[700px] overflow-hidden py-6 sm:py-10", className)}>
      <div className="relative flex h-[390px] items-center justify-center sm:h-[560px]">
        {items.map((item, index) => {
          const offset = (index - active + items.length) % items.length;
          const normalized = offset > items.length / 2 ? offset - items.length : offset;
          const isActive = normalized === 0;
          const visible = Math.abs(normalized) <= 2;
          return (
            <div key={item.src} className={cn("absolute aspect-[4/5] w-[64%] overflow-hidden rounded-[28px] border border-white/15 bg-[#0d1018] shadow-2xl transition-all duration-700 ease-out", isActive ? "z-20 scale-100 opacity-100 shadow-amber-300/15" : "z-10 scale-[.72] opacity-40 blur-[1px]", !visible && "pointer-events-none opacity-0")} style={{ transform: `translateX(${normalized * 68}%) scale(${isActive ? 1 : 0.72})` }} aria-hidden={!isActive}>
              <Image src={item.src} alt={item.alt} fill priority={isActive} sizes="(max-width: 640px) 58vw, 390px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-5 pb-5 pt-16">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3">
        <button type="button" onClick={() => move(-1)} aria-label="Previous image" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"><ChevronLeft size={18} /></button>
        <div className="flex gap-1.5" aria-label="Carousel slides">
          {items.map((item, index) => <button key={item.src} type="button" onClick={() => setActive(index)} aria-label={`Go to ${item.label}`} aria-current={index === active} className={cn("h-1.5 rounded-full transition-all", index === active ? "w-6 bg-amber-300" : "w-1.5 bg-white/35")} />)}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next image" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
