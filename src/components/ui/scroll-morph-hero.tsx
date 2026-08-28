"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language";

const images = [
  ["/images/showcase/tshirt-after1.jpg", "Fashion"],
  ["/images/showcase/snack-after4.jpg", "Food"],
  ["/images/showcase/tumbler-after1.jpg", "Lifestyle"],
  ["/images/showcase/watch-after4.jpg", "Accessories"],
  ["/images/showcase/kopi-after2.jpg", "Product"],
  ["/images/showcase/Character_1.jpg", "Portrait"],
  ["/images/showcase/kacang-after3.jpg", "Snack"],
  ["/images/showcase/watch-after2.jpg", "Watch"],
  ["/images/showcase/watch-after2.jpg", "Product"],
  ["/images/showcase/kopi-after3.jpg", "Coffee"],
  ["/images/showcase/snack-after1.jpg", "Food"],
  ["/images/showcase/Character_5.jpg", "Portrait"],
  ["/images/showcase/tumbler-after1.jpg", "Lifestyle"],
  ["/images/showcase/watch-after3.jpg", "Product"],
] as const;

function interpolate(value: number, input: number[], output: number[]) {
  for (let index = 1; index < input.length; index += 1) {
    if (value <= input[index]) {
      const amount = (value - input[index - 1]) / (input[index] - input[index - 1]);
      return output[index - 1] + (output[index] - output[index - 1]) * amount;
    }
  }
  return output[output.length - 1];
}

export function ScrollMorphHero() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const target = useRef<HTMLElement>(null);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 52, damping: 19, mass: 0.8 });
  const mouseX = useSpring(useMotionValue(0), { stiffness: 80, damping: 24 });

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || viewport.width < 768) return undefined;
    const move = (event: MouseEvent) => mouseX.set((event.clientX / window.innerWidth - 0.5) * 80);
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, reduceMotion, viewport.width]);

  const mobile = viewport.width < 640;
  const tablet = viewport.width < 1024;
  const cardWidth = mobile ? 62 : tablet ? 82 : 102;
  const cardHeight = cardWidth * 1.42;
  const radius = mobile ? Math.min(viewport.width * 0.32, 125) : tablet ? 205 : 285;
  const scatterX = mobile ? 150 : tablet ? 330 : 680;
  const scatterY = mobile ? 100 : tablet ? 230 : 390;
  const lineGap = mobile ? 52 : tablet ? 70 : 84;
  const phases = [0, 0.15, 0.35, 0.7, 1];
  const center = (images.length - 1) / 2;

  return (
    <section ref={target} className="relative h-[130vh] overflow-hidden bg-[#06070a] md:h-[150vh] lg:h-[165vh]">
      <div className="sticky top-16 h-[calc(100svh-64px)] overflow-hidden md:top-[72px] md:h-[calc(100svh-72px)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,185,66,.1),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(67,56,202,.1),transparent_32%)]" />
        <div className="absolute left-1/2 top-[38%] h-[min(66vw,660px)] w-[min(66vw,660px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.06]" />

        {images.map(([src, label], index) => {
          const offset = index - center;
          const lineX = offset * lineGap;
          const circleAngle = (index / images.length) * Math.PI * 2 - Math.PI / 2;
          const circleX = Math.cos(circleAngle) * radius;
          const circleY = Math.sin(circleAngle) * radius;
          const arcX = (index - center) * (mobile ? 56 : tablet ? 74 : 92);
          const arcY = Math.pow(Math.abs(index - center), 1.65) * (mobile ? 8 : 11) + (mobile ? 125 : 155);
          const x = useTransform(progress, phases, reduceMotion ? [arcX, arcX, arcX, arcX, arcX] : [offset * scatterX, lineX, circleX, arcX, arcX]);
          const y = useTransform(progress, phases, reduceMotion ? [arcY, arcY, arcY, arcY, arcY] : [((index % 5) - 2) * scatterY / 2, 0, circleY, arcY, arcY - 24]);
          const rotate = useTransform(progress, phases, reduceMotion ? [offset * 2, offset * 2, offset * 2, offset * 2, offset * 2] : [offset * 14, offset * 5, offset * 2, offset * (index % 2 ? 1 : -1), offset * (index % 2 ? 1 : -1)]);
          const scale = useTransform(progress, phases, reduceMotion ? [1, 1, 1, 1, 1] : [0.72, 0.82, 0.92, 1, 1]);
          const opacity = useTransform(progress, phases, reduceMotion ? [1, 1, 1, 1, 1] : [0.82, 1, 0.92, 1, 1]);
          const translateX = useTransform(mouseX, (value) => value * (index % 3 === 0 ? 0.5 : 0.25));

          return (
            <motion.div key={`${src}-${index}`} className="absolute left-1/2 top-[38%] z-10 overflow-hidden rounded-xl border border-white/20 bg-[#0b1020] shadow-2xl" style={{ width: cardWidth, height: cardHeight, x: useTransform([x, translateX], ([a, b]) => Number(a) + Number(b)), y, rotate, scale, opacity, marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2 }}>
              <Image src={src} alt={`${label} DowaLabs`} fill sizes={`${cardWidth}px`} className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[9px] font-semibold uppercase tracking-wide text-white/85">{label}</span>
            </motion.div>
          );
        })}

        <motion.div className="absolute inset-x-5 bottom-8 z-20 mx-auto max-w-xl text-center sm:bottom-10" style={{ opacity: useTransform(progress, [0.52, 0.7, 1], [0, 1, 1]), y: useTransform(progress, [0.52, 0.72, 1], [24, 0, 0]) }}>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.24em] text-amber-300/80">DOWALABS AI CREATIVE STUDIO</p>
          <h1 className="text-4xl font-semibold tracking-[-.05em] text-[#f3f0e6] sm:text-6xl">{language === "id" ? "Satu Foto. Banyak Kemungkinan." : "One Photo. Endless Possibilities."}</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/65 sm:text-base">{language === "id" ? "Dari product shot sederhana menjadi visual siap jual untuk marketplace, sosial media, dan campaign." : "Turn a simple product shot into sales-ready visuals for marketplaces, social media, and campaigns."}</p>
          <Link href="/signup" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f4c76b] px-4 py-2 text-sm font-semibold text-[#171108] transition-transform hover:scale-[1.03]">
            {language === "id" ? "Mulai Sekarang" : "Get Started"}<ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div className="absolute left-1/2 top-[13%] z-20 -translate-x-1/2 text-center" style={{ opacity: useTransform(progress, [0, 0.12, 0.3], [1, 0.8, 0]) }}>
          <h2 className="text-3xl font-semibold tracking-[-.04em] text-[#f3f0e6] sm:text-5xl">{language === "id" ? "Visual Produk, Dibentuk oleh AI." : "Product Visuals, Shaped by AI."}</h2>
          <p className="mt-3 text-sm text-white/55">{language === "id" ? "Scroll untuk melihat transformasi." : "Scroll to explore."}</p>
        </motion.div>
      </div>
    </section>
  );
}
