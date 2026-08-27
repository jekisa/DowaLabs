"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  children: ReactNode;
  startingGap?: number;
  breathing?: boolean;
  gradientColors?: string[];
  gradientStops?: number[];
  animationSpeed?: number;
  breathingRange?: number;
  containerStyle?: CSSProperties;
  containerClassName?: string;
  topOffset?: number;
}

export function AnimatedGradientBackground({ children, breathing = false, gradientColors = ["#06070A", "#10162A", "#312E81", "#F59E0B"], gradientStops = [0, 42, 78, 100], animationSpeed = 18, breathingRange = 0.08, containerStyle, containerClassName, topOffset = 0 }: AnimatedGradientBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const colors = gradientColors.map((color, index) => `${color} ${gradientStops[index] ?? Math.round((index / Math.max(gradientColors.length - 1, 1)) * 100)}%`).join(", ");
  const style = { ...containerStyle, "--ambient-gradient": `linear-gradient(115deg, ${colors})`, "--ambient-top": `${topOffset}px` } as CSSProperties;
  const shouldBreathe = breathing && !reduceMotion;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", containerClassName)} style={style}>
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[var(--ambient-gradient)]" animate={shouldBreathe ? { opacity: [1 - breathingRange, 1, 1 - breathingRange] } : undefined} transition={shouldBreathe ? { duration: animationSpeed, repeat: Infinity, ease: "easeInOut" } : undefined} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
