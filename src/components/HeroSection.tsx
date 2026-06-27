"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ImageIcon,
  MousePointerClick,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = ["Tanpa skill desain", "100+ prompt produk", "Siap untuk marketplace"];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05060b]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(70%_70%_at_82%_18%,rgba(82,70,190,0.23),transparent_65%),radial-gradient(55%_55%_at_15%_10%,rgba(245,185,66,0.12),transparent_72%),linear-gradient(180deg,#070912_0%,#05060b_78%)]" />
      <div className="absolute inset-0 -z-10 bg-grid-pattern bg-[size:64px_64px] opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <motion.div
        className="absolute -right-32 top-12 -z-10 h-[540px] w-[540px] rounded-full bg-indigo-500/[0.08] blur-[100px]"
        animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container grid min-h-[740px] items-center gap-12 pb-20 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl"
        >
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3.5 py-2 text-xs font-medium text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-300" />
            <span>AI Product Studio untuk Seller &amp; Affiliate</span>
          </div>

          <h1 className="max-w-full break-words text-3xl font-semibold leading-[1.14] tracking-normal text-white min-[420px]:text-4xl sm:text-5xl lg:text-[64px]">
            Buat Foto Produk Affiliate
            <span className="mt-1 block text-gradient-gold">Lebih Menarik dengan AI</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            DowaLabs membantu seller, affiliate, dan UMKM mengubah foto produk
            menjadi visual premium yang lebih siap jual, tanpa proses desain rumit.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full px-7 sm:w-auto">
              <Link href="/signup">
                Mulai Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/15 bg-white/[0.04] hover:bg-white/[0.08] sm:w-auto"
            >
              <Link href="/demo">
                <MousePointerClick className="h-5 w-5" />
                Lihat Demo
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {benefits.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <BadgeCheck className="h-4 w-4 shrink-0 text-amber-300" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[650px] pb-8 sm:px-5 lg:px-0"
        >
          <div className="absolute inset-x-8 bottom-2 top-16 -z-10 bg-violet-500/20 blur-[90px]" />
          <div className="glass-panel relative overflow-hidden rounded-[8px] p-2 sm:p-3">
            <div className="flex h-10 items-center justify-between border-b border-white/[0.08] px-2 sm:px-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                <span className="h-2 w-2 rounded-full bg-amber-300/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 sm:text-xs">
                <WandSparkles className="h-3.5 w-3.5 text-amber-300" />
                DowaLabs Canvas
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="grid gap-2 pt-2 sm:grid-cols-[132px_1fr] sm:gap-3 sm:pt-3">
              <div className="hidden space-y-2 sm:block">
                {["Upload foto", "Pilih gaya", "Generate"].map((label, index) => (
                  <div
                    key={label}
                    className={
                      index === 2
                        ? "rounded-[8px] border border-amber-300/20 bg-amber-300/[0.08] p-3"
                        : "rounded-[8px] border border-white/[0.08] bg-white/[0.025] p-3"
                    }
                  >
                    <span className="text-[10px] text-slate-500">0{index + 1}</span>
                    <p className="mt-1 text-xs font-medium text-slate-200">{label}</p>
                  </div>
                ))}
                <div className="rounded-[8px] border border-white/[0.08] bg-black/20 p-3">
                  <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-400">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Output 4:5
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 to-violet-400"
                      animate={{ width: ["38%", "92%", "38%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative aspect-[5/4] min-h-[310px] overflow-hidden rounded-[8px] border border-white/10 bg-[#090c17] sm:min-h-0">
                <Image
                  src="/images/dowalabs-product-studio.png"
                  alt="Contoh foto produk premium hasil DowaLabs AI Product Studio"
                  fill
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070d]/80 via-transparent to-transparent" />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-[8px] border border-white/10 bg-[#06070d]/70 p-3 backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4">
                  <div>
                    <p className="text-[10px] uppercase text-amber-300">AI output</p>
                    <p className="mt-1 text-xs font-medium text-white sm:text-sm">
                      Premium studio campaign
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="glass absolute -bottom-1 left-2 hidden w-48 rounded-[8px] p-3 sm:block lg:-left-8"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-amber-300/10 text-amber-300">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-white">Visual siap jual</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Generate dalam satu alur</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="soft-divider absolute inset-x-0 bottom-0 h-px" />
    </section>
  );
}
