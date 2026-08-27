"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language";
import { heroPricing, showcaseCategories } from "@/components/landing/landing-data";
import { ImageComparisonSlider } from "@/components/ui/image-comparison-slider";
import { cn } from "@/lib/utils";

// kopi-before / watch-before are 225x225 sources - too blurry for the frame, so
// Food + Accessories + Electronics stay in the data but are not rendered.
const hiddenCategories = ["food", "accessories", "electronics"];
const categories = showcaseCategories.filter((item) => !hiddenCategories.includes(item.id));

function ParticleCanvas({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    let frame = 0;
    let particles: { x: number; y: number; speed: number; size: number }[] = [];
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(55, Math.floor((window.innerWidth * canvas.clientHeight) / 15000)) }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * canvas.clientHeight,
        speed: 0.05 + Math.random() * 0.12,
        size: 0.5 + Math.random() * 0.5,
      }));
    };
    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, canvas.clientHeight);
      context.fillStyle = "rgba(15, 23, 42, 0.14)";
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        if (particle.y < 0) particle.y = canvas.clientHeight;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

export function HeroMinimalism() {
  const { language } = useLanguage();
  const isId = language === "id";
  const reduced = useReducedMotion();
  const pricing = heroPricing[language];
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const active = categories.find((item) => item.id === categoryId) ?? categories[0];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(useTransform(mouseX, [-1, 1], [-50, 50]), { stiffness: 90, damping: 24 });
  const spotlightY = useSpring(useTransform(mouseY, [-1, 1], [-40, 40]), { stiffness: 90, damping: 24 });
  const transition = (delay: number) => ({ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const });

  return (
    <section
      // the navbar's "Contoh" link points at #examples; the before/after it used
      // to target is part of this hero now, so the anchor lives here.
      id="examples"
      className="relative overflow-visible border-b border-slate-200/60 bg-white"
      onMouseMove={reduced ? undefined : (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
        mouseY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
      }}
    >
      <ParticleCanvas reduced={Boolean(reduced)} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,.08),rgba(59,130,246,.035)_38%,transparent_70%)] blur-3xl"
        style={reduced ? undefined : { x: spotlightX, y: spotlightY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] [background-size:25%_33.333%]"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: reduced ? 0 : 0.85, ease: "easeOut" }}
      />

      {/* 1.3fr/1fr = ~57/43. The copy column is left-aligned at every width; in
          one column it comes first so price + CTA stay above the fold and the
          comparison sits under it. */}
      <div className="relative mx-auto grid w-[calc(100%-48px)] max-w-[1600px] items-center gap-8 py-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12 lg:py-12">
        <div className="min-w-0">
          <motion.p className="text-[13px] font-semibold uppercase tracking-[.18em] text-amber-600" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={transition(0)}>
            DowaLabs
          </motion.p>
          <motion.h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-[-.055em] text-[#111111] sm:text-5xl lg:text-[54px]" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition(0.08)}>
            {isId ? "Semua Tool Kreatif untuk Bikin Konten Jualan Lebih Cepat." : "Every Creative Tool to Make Selling Content Faster."}
          </motion.h1>
          <motion.p className="mt-5 max-w-[620px] text-base leading-[1.6] text-slate-500 md:text-lg" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={transition(0.16)}>
            {isId ? "Ubah foto produk, bikin visual promosi, hapus background, sampai siap posting ke marketplace dan sosial media — semua dalam satu workspace." : "Transform product photos, create promotional visuals, remove backgrounds, and get ready to post across marketplaces and social media — all in one workspace."}
          </motion.p>
          <motion.p className="mt-5 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 md:text-base" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={transition(0.2)}>
            {pricing.line}
          </motion.p>
          <motion.div initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={transition(0.24)}>
            <Link href="/signup" className="group mt-6 inline-flex min-h-16 items-center gap-3 rounded-xl bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(245,185,66,0.34)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-gold-400 hover:shadow-[0_14px_28px_rgba(245,185,66,0.44)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1220] focus-visible:ring-offset-2">
              {pricing.cta}
              <ArrowRight size={21} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto w-full min-w-0 max-w-[480px] lg:mr-0 lg:max-w-[560px]"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.3)}
        >
          <ImageComparisonSlider
            key={active.id}
            beforeImage={active.before}
            afterImage={active.after}
            altBefore={`${isId ? "Sebelum" : "Before"}: ${active.alt}`}
            altAfter={`${isId ? "Sesudah AI" : "After AI"}: ${active.alt}`}
            beforeLabel={isId ? "Sebelum" : "Before"}
            afterLabel={isId ? "Sesudah AI" : "After AI"}
            objectPosition={active.focus}
            priority
          />
          {/* one row, equal widths via flex-1 + min-w-0. The thumbnail drops out
              under 640px so the longest label still fits without a scroller. */}
          <div className="mt-3 flex gap-2">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategoryId(item.id)}
                aria-pressed={item.id === active.id}
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border bg-white px-2 py-2.5 text-[13px] font-bold text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:justify-start sm:px-2.5",
                  // hover only on the unselected pills: Tailwind emits hover
                  // variants after the base utilities, so a shared hover:bg would
                  // paint over the selected pill's amber the moment you touch it.
                  item.id === active.id
                    ? "border-amber-400 bg-amber-50 shadow-[0_2px_10px_rgba(245,158,11,0.18)]"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <Image src={item.before} alt="" width={32} height={32} className="hidden h-8 w-8 shrink-0 rounded-md object-cover object-center sm:block" />
                <span className="truncate">{isId ? item.label : item.labelEn}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
