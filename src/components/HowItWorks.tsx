"use client";

import { motion } from "framer-motion";
import { CreditCard, LayoutDashboard, LogIn, WandSparkles } from "lucide-react";

const steps = [
  { title: "Daftar akun", detail: "Buat akun menggunakan email dan WhatsApp aktif.", icon: LogIn },
  { title: "Aktifkan Pro", detail: "Aktifkan paket Pro Rp30.000 untuk 30 hari.", icon: CreditCard },
  { title: "Buka Canvas", detail: "Akses DowaLabs Canvas langsung dari dashboard.", icon: LayoutDashboard },
  { title: "Generate visual", detail: "Buat foto produk premium yang siap dipasarkan.", icon: WandSparkles },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="section-glow py-20 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">Cara kerja</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            Empat langkah dari daftar sampai siap berkarya
          </h2>
        </div>

        <div className="relative grid gap-3 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent md:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="glass relative rounded-[8px] p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-amber-300/15 bg-[#0c0e18] text-amber-300 shadow-[0_0_30px_rgba(245,185,66,0.08)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">0{index + 1}</span>
                </div>
                <h3 className="mt-6 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
