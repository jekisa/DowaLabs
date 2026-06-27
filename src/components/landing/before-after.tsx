"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Wand2 } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";

export function BeforeAfter() {
  const [value, setValue] = useState(50);

  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Before / After"
        title="Dari Foto Biasa ke Siap Jual"
        description="Geser untuk melihat perbedaan kualitas visual produk sebelum dan sesudah DowaLabs."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-10 max-w-3xl"
      >
        <div className="glass relative aspect-[16/9] select-none overflow-hidden rounded-2xl">
          {/* "After" layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/25 to-navy-800">
            <Wand2 className="h-10 w-10 text-gold-400" />
            <span className="font-semibold">Sesudah DowaLabs</span>
            <span className="text-xs text-muted-foreground">
              Premium • Bersih • Menjual
            </span>
          </div>

          {/* "Before" layer clipped by slider */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-800"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          >
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">
              Sebelum
            </span>
            <span className="text-xs text-muted-foreground/70">
              Foto produk apa adanya
            </span>
          </div>

          {/* Divider line */}
          <div
            className="absolute inset-y-0 w-0.5 bg-gold-400"
            style={{ left: `${value}%` }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="mt-6 w-full accent-gold-500"
          aria-label="Before after slider"
        />
      </motion.div>
    </section>
  );
}
