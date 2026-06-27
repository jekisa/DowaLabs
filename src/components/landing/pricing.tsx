"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/landing/section-heading";
import { formatIDR } from "@/lib/utils";

const BASIC_FEATURES = [
  "Akses dashboard member",
  "Akses DowaLabs AI Canvas",
  "Akses tutorial dasar",
  "Masa aktif 30 hari",
];

const PRO_FEATURES = [
  "Semua fitur Basic",
  "Akses prompt premium",
  "Template & preset tambahan",
  "Prioritas update",
  "Masa aktif 30 hari",
];

export function Pricing({
  basicPrice = 19000,
  proPrice = 35000,
  withHeading = true,
}: {
  basicPrice?: number;
  proPrice?: number;
  withHeading?: boolean;
}) {
  return (
    <section id="pricing" className="container py-20">
      {withHeading && (
        <SectionHeading
          eyebrow="Harga"
          title="Pilih Paket yang Sesuai"
          description="Mulai dari harga terjangkau. Upgrade kapan saja sesuai kebutuhan jualan kamu."
        />
      )}

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Basic */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass flex flex-col rounded-2xl p-8"
        >
          <h3 className="text-xl font-semibold">Basic</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Untuk yang baru mulai jualan online.
          </p>
          <div className="mt-6 flex items-end gap-1">
            <span className="text-4xl font-bold">{formatIDR(basicPrice)}</span>
            <span className="mb-1 text-sm text-muted-foreground">/bulan</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {BASIC_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gold-400" /> {f}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/signup?package=basic">Pilih Basic</Link>
          </Button>
        </motion.div>

        {/* Pro */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative flex flex-col rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/10 to-card p-8 shadow-lg shadow-primary/10"
        >
          <Badge className="absolute right-6 top-6">Paling Populer</Badge>
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Untuk seller serius yang ingin hasil maksimal.
          </p>
          <div className="mt-6 flex items-end gap-1">
            <span className="text-4xl font-bold text-gradient-gold">
              {formatIDR(proPrice)}
            </span>
            <span className="mb-1 text-sm text-muted-foreground">/bulan</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gold-400" /> {f}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8">
            <Link href="/signup?package=pro">Pilih Pro</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
