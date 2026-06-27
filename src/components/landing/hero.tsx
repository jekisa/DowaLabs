"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container relative grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gold-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Product Studio untuk Seller & Affiliate
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            DowaLabs{" "}
            <span className="text-gradient-gold">AI Product Studio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Buat foto produk affiliate lebih menarik, premium, dan siap jual
            dengan bantuan AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/signup">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/demo">
                <PlayCircle className="h-4 w-4" /> Lihat Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <div>
              <span className="block text-2xl font-bold text-foreground">
                30 hari
              </span>
              akses per pembayaran
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <span className="block text-2xl font-bold text-foreground">
                Mulai Rp19rb
              </span>
              paket Basic
            </div>
          </motion.div>
        </div>

        {/* Hero visual / video placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="glass relative aspect-video overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-gold-400">
                <PlayCircle className="h-8 w-8" />
              </span>
              <p className="text-sm font-medium text-muted-foreground">
                Video demo DowaLabs AI Canvas
              </p>
              <p className="text-xs text-muted-foreground/60">
                (placeholder — ganti dengan video produk kamu)
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-2xl bg-primary/30 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
