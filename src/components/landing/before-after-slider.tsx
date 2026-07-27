"use client";

import Image from "next/image";
import { useState } from "react";

export function BeforeAfterSlider({
  before,
  after,
  alt,
  priority = false,
}: {
  before: string;
  after: string;
  alt: string;
  priority?: boolean;
}) {
  const [value, setValue] = useState(52);

  return (
    <div className="relative select-none overflow-hidden rounded-2xl border border-white/10 bg-[#080b14] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/5] sm:aspect-[16/11]">
        <Image
          src={after}
          alt={`Sesudah: ${alt}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-contain"
        />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${value}%` }}>
          <div className="relative h-full" style={{ width: `${10000 / value}%` }}>
            <Image
              src={before}
              alt={`Sebelum: ${alt}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/65 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
          Before
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-amber-300/25 bg-black/65 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-md">
          After AI
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-amber-300 shadow-[0_0_30px_rgba(245,185,66,0.9)]"
          style={{ left: `${value}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/70 bg-[#120f08]/90 text-xs font-bold text-amber-100 shadow-[0_0_35px_rgba(245,185,66,0.45)]">
            Drag
          </span>
        </div>
        <input
          aria-label="Geser untuk membandingkan before dan after"
          type="range"
          min={5}
          max={95}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  );
}
