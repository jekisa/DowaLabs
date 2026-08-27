"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
  beforeLabel?: string;
  afterLabel?: string;
  priority?: boolean;
  className?: string;
  /** object-position shared by BOTH images; they must match or the two halves drift apart. */
  objectPosition?: string;
}

export function ImageComparisonSlider({ beforeImage, afterImage, altBefore = "Before image", altAfter = "After image", beforeLabel = "Before", afterLabel = "After AI", priority = false, className, objectPosition = "center top" }: ImageComparisonProps) {
  const fit = { objectFit: "cover" as const, objectPosition };
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((value) => Math.min(100, Math.max(0, value + (event.key === "ArrowRight" ? 5 : -5))));
    }
  };

  return (
    <div ref={frameRef} className={cn("relative touch-pan-y aspect-[4/5] select-none overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#f1f5f9] shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:aspect-square", dragging ? "cursor-ew-resize" : "cursor-col-resize", className)} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); updatePosition(event.clientX); }} onPointerMove={(event) => { if (dragging) updatePosition(event.clientX); }} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); }} onPointerCancel={() => setDragging(false)} onKeyDown={handleKeyDown} role="slider" tabIndex={0} aria-label="Image comparison slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)}>
      <Image src={afterImage} alt={altAfter} fill priority={priority} sizes="(max-width: 1023px) 92vw, 480px" style={fit} className="pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={beforeImage} alt={altBefore} fill priority={priority} sizes="(max-width: 1023px) 92vw, 480px" style={fit} />
      </div>
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{beforeLabel}</div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">{afterLabel}</div>
      <div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.35)]" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-400 bg-white text-slate-700 shadow-md"><ChevronLeft size={14} /><ChevronRight size={14} /></span>
      </div>
    </div>
  );
}
