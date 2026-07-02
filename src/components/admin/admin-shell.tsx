"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { AdminSidebar, ADMIN_ITEMS } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [softTheme, setSoftTheme] = useState(false);
  const current = ADMIN_ITEMS.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href)
  );

  return (
    <div
      className={cn(
        "min-h-screen overflow-x-hidden text-white transition-colors duration-500",
        softTheme ? "bg-[#0a1020]" : "bg-[#050713]"
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(245,185,66,0.09),transparent_24%),radial-gradient(circle_at_88%_4%,rgba(99,102,241,0.11),transparent_28%),linear-gradient(145deg,#050713,#070b17_50%,#05060c)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern bg-[size:64px_64px] opacity-[0.07] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
      />

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] border-r border-white/[0.06] bg-[#070914]/80 p-4 backdrop-blur-2xl lg:block">
        <AdminSidebarContent user={user} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.button
            type="button"
            aria-label="Tutup navigasi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative h-full w-[min(88vw,320px)] border-r border-white/10 bg-[#080b16] p-4 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Tutup navigasi"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <AdminSidebarContent
              user={user}
              onNavigate={() => setSidebarOpen(false)}
            />
          </motion.aside>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060914]/75 backdrop-blur-2xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 xl:px-10">
            <button
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Admin Console
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {current?.label || "Admin"}
              </p>
            </div>
            <div className="relative max-w-md flex-1 sm:ml-6">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                aria-label="Cari menu admin"
                placeholder="Cari di admin..."
                className="h-11 w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/10 focus:border-amber-300/30 focus:ring-4 focus:ring-amber-300/[0.05]"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Notifikasi admin"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-300" />
              </button>
              <button
                type="button"
                aria-label="Ganti nuansa mode gelap"
                aria-pressed={softTheme}
                onClick={() => setSoftTheme((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                {softTheme ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </button>
              <details className="group relative hidden sm:block">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl p-1.5 pr-2 transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [&::-webkit-details-marker]:hidden">
                  <AdminAvatar name={user.name} compact />
                  <span className="hidden max-w-28 truncate text-xs font-medium xl:block">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition group-open:rotate-180" />
                </summary>
                <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/10 bg-[#101420] p-2 shadow-2xl">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                  >
                    <UserRound className="h-4 w-4" /> Lihat sebagai user
                  </Link>
                  <LogoutButton variant="ghost" className="w-full justify-start" />
                </div>
              </details>
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-72px)] max-w-[1560px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebarContent({
  user,
  onNavigate,
}: {
  user: { name: string; email: string };
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex h-14 items-center gap-3 rounded-2xl px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-[0_10px_30px_rgba(245,185,66,0.22)]">
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">DowaLabs</span>
          <span className="block text-[11px] text-amber-300">Admin Console</span>
        </span>
      </Link>
      <div className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
        Management
      </div>
      <div className="mt-3">
        <AdminSidebar onNavigate={onNavigate} />
      </div>
      <div className="mt-auto pt-6">
        <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.035] p-3">
          <div className="flex items-center gap-3">
            <AdminAvatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {user.email}
              </p>
            </div>
          </div>
          <LogoutButton
            variant="ghost"
            className="mt-3 w-full justify-start border-t border-white/[0.06] pt-3 text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

function AdminAvatar({ name, compact = false }: { name: string; compact?: boolean }) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 font-semibold text-black",
        compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
      )}
    >
      {initials}
    </span>
  );
}
