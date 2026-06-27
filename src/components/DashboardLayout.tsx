"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CreditCard,
  LayoutDashboard,
  Lock,
  Menu,
  PlayCircle,
  Rocket,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";

const member = {
  name: "Alya Seller",
  packageName: "Pro",
  status: "active" as const,
  pendingStatus: "pending" as const,
  expiredAt: "27 Juli 2026",
};

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"active" | "pending">("active");
  const active = status === "active";

  return (
    <div className="min-h-screen bg-[#050713] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(245,185,66,0.16),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(88,101,242,0.2),transparent_30%),linear-gradient(135deg,#050713,#080d1d)]" />
      <div className="fixed inset-0 -z-10 bg-grid-pattern bg-[size:52px_52px] opacity-20" />

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-black/20 p-5 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050713]/75 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-amber-300" />
            DowaLabs
          </Link>
          <button
            type="button"
            aria-label="Buka navigasi"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            className="relative h-full w-[min(86vw,320px)] border-r border-white/10 bg-[#090d1c] p-5"
          >
            <button
              type="button"
              aria-label="Tutup navigasi"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/5"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </motion.aside>
        </div>
      )}

      <main className="px-4 py-8 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-amber-300">Dashboard Member</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal">
                  Selamat datang di DowaLabs
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Akses tool AI Product Studio dan mulai buat foto produk
                  affiliate yang siap jual.
                </p>
              </div>
              <div className="flex rounded-lg border border-white/10 bg-black/20 p-1">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`rounded-md px-3 py-2 text-xs ${active ? "bg-emerald-400 text-black" : "text-slate-300"}`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  className={`rounded-md px-3 py-2 text-xs ${!active ? "bg-amber-300 text-black" : "text-slate-300"}`}
                >
                  Pending
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Status Membership</h2>
                <StatusBadge status={active ? member.status : member.pendingStatus} />
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <InfoRow label="Nama" value={member.name} />
                <InfoRow label="Paket" value={member.packageName} />
                <InfoRow label="Masa aktif" value={active ? member.expiredAt : "-"} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">DowaLabs AI Canvas</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {active
                      ? "Status aktif. Tombol Canvas siap digunakan."
                      : "Akses terkunci. Selesaikan pembayaran untuk membuka Canvas."}
                  </p>
                </div>
                <Button asChild={active} disabled={!active} size="lg" className="w-full md:w-auto">
                  {active ? (
                    <a href="https://gemini.google.com/" target="_blank" rel="noreferrer">
                      <Rocket className="h-5 w-5" />
                      Buka DowaLabs AI Canvas
                    </a>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Akses Terkunci
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Tutorial Video" icon={<PlayCircle className="h-5 w-5" />} className="lg:col-span-2">
              <div className="mt-4 flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(245,185,66,0.25),transparent_34%),linear-gradient(135deg,#111936,#070a16)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-300/15 text-amber-200">
                  <PlayCircle className="h-9 w-9" />
                </div>
              </div>
            </Card>

            <Card title="Quick Action" icon={<WandSparkles className="h-5 w-5" />}>
              <div className="mt-4 grid gap-3">
                <Button asChild variant="outline">
                  <Link href="/payment">
                    <CreditCard className="h-4 w-4" />
                    Lihat Payment
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/demo">
                    <PlayCircle className="h-4 w-4" />
                    Lihat Demo
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-3 font-semibold">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300 text-black">
          <Sparkles className="h-5 w-5" />
        </span>
        DowaLabs
      </Link>
      <nav className="mt-8 grid gap-2 text-sm">
        <Link className="flex items-center gap-3 rounded-lg bg-white/8 px-3 py-3 text-white" href="/dashboard">
          <LayoutDashboard className="h-4 w-4 text-amber-300" />
          Dashboard
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5" href="/payment">
          <CreditCard className="h-4 w-4" />
          Payment
        </Link>
      </nav>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">
        Cocok untuk affiliate marketplace, seller, reseller, dan UMKM.
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function Card({
  title,
  icon,
  className,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/12 text-amber-300">
          {icon}
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
