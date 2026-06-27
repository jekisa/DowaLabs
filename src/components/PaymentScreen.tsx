"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";

const plans = {
  basic: {
    name: "Basic",
    price: "Rp19.000",
    lynk: "https://lynk.id/dowalabs/basic",
  },
  pro: {
    name: "Pro",
    price: "Rp35.000",
    lynk: "https://lynk.id/dowalabs/pro",
  },
};

export function PaymentScreen() {
  const params = useSearchParams();
  const planKey = params.get("plan") === "basic" ? "basic" : "pro";
  const plan = plans[planKey];

  return (
    <div className="min-h-screen bg-[#050713] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(245,185,66,0.18),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(88,101,242,0.22),transparent_30%),linear-gradient(135deg,#050713,#080d1d)]" />
      <div className="fixed inset-0 -z-10 bg-grid-pattern bg-[size:52px_52px] opacity-20" />

      <header className="border-b border-white/10 bg-[#050713]/75 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300 text-black">
              <Sparkles className="h-5 w-5" />
            </span>
            DowaLabs
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/signup">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-amber-300">Paket dipilih</p>
              <StatusBadge status="pending" />
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal">
              {plan.name}
            </h1>
            <p className="mt-3 text-3xl font-semibold text-amber-300">
              {plan.price}
              <span className="text-sm font-normal text-slate-400"> / bulan</span>
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Akses DowaLabs Canvas",
                planKey === "pro" ? "Prompt premium dan template affiliate" : "Prompt dasar",
                "Tutorial penggunaan",
                "Status akun: Menunggu Aktivasi",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-300" />
                  {item}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <h2 className="text-2xl font-semibold tracking-normal">
              Instruksi pembayaran
            </h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li>1. Klik tombol Bayar via Lynk untuk membuka halaman pembayaran.</li>
              <li>2. Selesaikan pembayaran sesuai instruksi Lynk.</li>
              <li>3. Kirim bukti pembayaran ke WhatsApp admin jika status belum aktif.</li>
              <li>4. Setelah aktif, buka dashboard dan klik tombol Canvas.</li>
            </ol>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg">
                <a href={plan.lynk} target="_blank" rel="noreferrer">
                  <CreditCard className="h-5 w-5" />
                  Bayar via Lynk
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20admin%20DowaLabs%2C%20saya%20sudah%20bayar."
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat Admin WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              Status Menunggu Aktivasi. Admin akan mengaktifkan akun setelah
              pembayaran terverifikasi.
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
