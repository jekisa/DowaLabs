"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronDown,
  CreditCard,
  Eraser,
  ExternalLink,
  ImageIcon,
  LayoutDashboard,
  Lock,
  Menu,
  Palette,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { LogoutButton } from "@/components/auth/logout-button";
import type { PublicUser } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import {
  CANVAS_TOOLS,
  type CanvasLinks,
  type CanvasToolKey,
} from "@/lib/canvas-tools";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payment", label: "Transfer Bank", icon: CreditCard },
];

export function UserAreaShell({
  user,
  title,
  eyebrow,
  canvasLinks,
  children,
}: {
  user: PublicUser;
  title: string;
  eyebrow: string;
  canvasLinks: CanvasLinks;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function openTool(key: CanvasToolKey, label: string) {
    if (!user.canAccessCanvas) {
      toast.error("Aktifkan membership untuk membuka tool ini.");
      return;
    }
    const url = canvasLinks[key];
    if (!url) {
      toast.error(`Link ${label} belum diatur oleh admin.`);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <Link href="/" onClick={onNavigate} className="flex h-14 items-center gap-3 rounded-2xl px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-[0_10px_30px_rgba(245,185,66,0.22)]"><Sparkles className="h-5 w-5" /></span>
        <span><span className="block text-sm font-semibold">DowaLabs</span><span className="block text-[11px] text-slate-500">AI Product Studio</span></span>
      </Link>
      <div className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Workspace</div>
      <nav aria-label="Navigasi dashboard" className="mt-3 grid gap-1.5">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300", active ? "bg-gradient-to-r from-amber-300/[0.14] to-transparent font-medium text-white shadow-[inset_0_0_0_1px_rgba(245,185,66,0.12)]" : "text-slate-400 hover:translate-x-0.5 hover:bg-white/[0.04] hover:text-white")}>
              {active && <motion.span layoutId="user-area-active-nav" className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,185,66,0.8)]" />}
              <Icon className={cn("h-[18px] w-[18px]", active ? "text-amber-300" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Gemini Canvas</div>
      <nav aria-label="Gemini Canvas tools" className="mt-3 grid gap-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {CANVAS_TOOLS.map((tool) => {
          const Icon = toolIcon(tool.key);
          const ready = user.canAccessCanvas && Boolean(canvasLinks[tool.key]);
          return (
            <button key={tool.key} type="button" onClick={() => openTool(tool.key, tool.label)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
              <Icon className="h-4 w-4 text-slate-600 transition group-hover:text-amber-300" />
              <span className="truncate">{tool.label}</span>
              {ready ? <ExternalLink className="ml-auto h-3 w-3 text-slate-700 group-hover:text-amber-300" /> : <Lock className="ml-auto h-3 w-3 text-slate-700" />}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[20px] border border-white/[0.07] bg-white/[0.035] p-3">
        <div className="flex items-center gap-3"><Avatar name={user.name} /><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="mt-0.5 text-[11px] text-amber-300">{user.packageName.toUpperCase()} Member</p></div></div>
        <LogoutButton variant="ghost" className="mt-3 w-full justify-start border-t border-white/[0.06] pt-3 text-slate-400" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050713] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(245,185,66,0.1),transparent_24%),radial-gradient(circle_at_88%_4%,rgba(99,102,241,0.12),transparent_28%),linear-gradient(145deg,#050713,#070b17_50%,#05060c)]" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern bg-[size:64px_64px] opacity-[0.07] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] border-r border-white/[0.06] bg-[#070914]/80 p-4 backdrop-blur-2xl lg:block">{sidebar()}</aside>
      {open && <div className="fixed inset-0 z-[70] lg:hidden"><motion.button type="button" aria-label="Tutup navigasi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" /><motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} className="relative h-full w-[min(88vw,320px)] border-r border-white/10 bg-[#080b16] p-4"><button type="button" aria-label="Tutup navigasi" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5"><X className="h-5 w-5" /></button>{sidebar(() => setOpen(false))}</motion.aside></div>}
      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060914]/75 backdrop-blur-2xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 xl:px-10">
            <button type="button" aria-label="Buka navigasi" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] lg:hidden"><Menu className="h-5 w-5" /></button>
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">{eyebrow}</p><p className="mt-1 text-sm font-medium text-slate-200">{title}</p></div>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" aria-label="Notifikasi" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-300" /></button>
              <details className="group relative hidden sm:block"><summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl p-1.5 pr-2 hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden"><Avatar name={user.name} compact /><span className="hidden max-w-28 truncate text-xs font-medium xl:block">{user.name}</span><ChevronDown className="h-3.5 w-3.5 text-slate-500 group-open:rotate-180" /></summary><div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/10 bg-[#101420] p-2 shadow-2xl"><div className="px-3 py-2"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div><Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5"><UserRound className="h-4 w-4" />Profil</Link><LogoutButton variant="ghost" className="w-full justify-start" /></div></details>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-10">{children}</main>
      </div>
    </div>
  );
}

function Avatar({ name, compact = false }: { name: string; compact?: boolean }) {
  const value = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "DL";
  return <span className={cn("grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 font-semibold text-black", compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs")}>{value}</span>;
}

function toolIcon(key: CanvasToolKey) {
  return {
    productStudio: Camera,
    backgroundRemover: Eraser,
    colorGrading: Palette,
    portraitStyle: ImageIcon,
    promptAi: BookOpen,
  }[key];
}
