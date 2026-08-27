"use client";

import { motion, useInView, useReducedMotion, type Transition, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface InViewProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  transition?: Transition;
  viewOptions?: { amount?: "some" | "all" | number; margin?: `${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"}` };
  once?: boolean;
}

const defaultVariants: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export function InView({ children, className, variants = defaultVariants, transition = { duration: 0.48, ease: "easeOut" }, viewOptions, once = true }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: viewOptions?.amount ?? 0.2, margin: viewOptions?.margin, once });
  return <motion.div ref={ref} className={cn(className)} initial={reduceMotion ? false : "hidden"} animate={reduceMotion || inView ? "visible" : "hidden"} variants={variants} transition={reduceMotion ? { duration: 0 } : transition}>{children}</motion.div>;
}
