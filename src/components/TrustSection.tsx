"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const stats = [
  { value: "5.000+", label: "target kontak WA siap dipasarkan" },
  { value: "5.000", label: "prompt produk siap digunakan" },
  { value: "24/7", label: "akses dashboard membership" },
  { value: "Affiliate", label: "dibuat untuk kebutuhan marketplace" },
];

export function TrustSection() {
  return (
    <section className="border-b border-white/[0.06] bg-[#090b13] py-12 sm:py-16">
      <div className="container">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-300">
          <BadgeCheck className="h-4 w-4 text-amber-300" />
          Dibangun untuk workflow seller dan affiliate
        </div>
        <div className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 14 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="border-white/10 lg:border-l lg:pl-7 first:lg:border-l-0 first:lg:pl-0"
            >
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 max-w-[210px] text-sm leading-6 text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
