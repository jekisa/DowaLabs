"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  CreditCard,
  Crown,
  Eraser,
  ExternalLink,
  FolderKanban,
  Headphones,
  Heart,
  History,
  ImageIcon,
  Images,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Menu,
  Moon,
  Palette,
  MoreHorizontal,
  Play,
  ReceiptText,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserRound,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CanvasButton } from "@/components/dashboard/canvas-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { MembershipBadge } from "@/components/membership-badge";
import type { PublicUser } from "@/lib/serialize";
import { cn, formatDate } from "@/lib/utils";
import {
  CANVAS_TOOLS,
  type CanvasLinks,
  type CanvasToolKey,
} from "@/lib/canvas-tools";

const NAV_ITEMS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payment", label: "Transfer Bank", icon: CreditCard },
];

const PROJECTS = [
  { name: "Product Hero", type: "Studio", position: "50% 52%" },
  { name: "Catalog Visual", type: "E-commerce", position: "43% 58%" },
  { name: "Social Campaign", type: "Lifestyle", position: "62% 50%" },
  { name: "Premium Packshot", type: "Product", position: "54% 44%" },
  { name: "Affiliate Creative", type: "Campaign", position: "48% 64%" },
  { name: "Brand Moodboard", type: "Concept", position: "58% 56%" },
];

const QUICK_ACTIONS: Array<{
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}> = [
    { label: "Transfer Bank", description: "Bayar atau perpanjang", href: "/payment", icon: CreditCard },
    { label: "Tutorial", description: "Pelajari workflow", href: "/demo", icon: BookOpen },
    { label: "Billing", description: "Invoice membership", href: "/payment", icon: ReceiptText },
    { label: "History", description: "Riwayat pembayaran", href: "/payment", icon: History },
    { label: "Support", description: "Bantuan & FAQ", href: "/faq", icon: Headphones },
    { label: "Settings", description: "Segera tersedia", href: "/dashboard", icon: Settings, disabled: true },
  ];

export function DashboardLayout({
  user,
  canvasLinks,
}: {
  user: PublicUser;
  canvasLinks: CanvasLinks;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [softTheme, setSoftTheme] = useState(false);
  const active = user.canAccessCanvas;
  const canvasUrl = canvasLinks.productStudio;

  return (
    <div
      className={cn(
        "min-h-screen overflow-x-hidden text-white transition-colors duration-500",
        softTheme ? "bg-[#0a1020]" : "bg-[#050713]"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500",
          softTheme ? "opacity-60" : "opacity-100",
          "bg-[radial-gradient(circle_at_16%_8%,rgba(245,185,66,0.11),transparent_24%),radial-gradient(circle_at_88%_5%,rgba(99,102,241,0.13),transparent_28%),linear-gradient(145deg,#050713_0%,#070b17_50%,#05060c_100%)]"
        )}
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern bg-[size:64px_64px] opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] border-r border-white/[0.06] bg-[#070914]/80 p-4 backdrop-blur-2xl lg:block">
        <SidebarContent user={user} canvasLinks={canvasLinks} />
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
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative h-full w-[min(88vw,320px)] border-r border-white/10 bg-[#080b16] p-4 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Tutup navigasi"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent user={user} canvasLinks={canvasLinks} onNavigate={() => setSidebarOpen(false)} />
          </motion.aside>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <TopBar
          user={user}
          softTheme={softTheme}
          onToggleTheme={() => setSoftTheme((value) => !value)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto max-w-[1560px] space-y-5 px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
          <HeroBanner user={user} canvasUrl={canvasUrl} />
          <StatsCards user={user} />
          <CanvasToolsGrid user={user} canvasLinks={canvasLinks} />

          <div className="grid gap-5 xl:grid-cols-[0.72fr_1.65fr]">
            <MembershipCard user={user} />
            <AIStudioCard user={user} canvasUrl={canvasUrl} />
          </div>

          <details id="dashboard-more" className="group rounded-[24px] border border-white/[0.06] bg-white/[0.02] open:bg-transparent">
            <summary className="flex cursor-pointer list-none items-center gap-4 rounded-[24px] px-5 py-4 transition hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [&::-webkit-details-marker]:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-amber-300"><LayoutDashboard className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Aktivitas &amp; panduan lainnya</span><span className="mt-0.5 block text-xs text-slate-500">Tutorial, riwayat, project contoh, shortcut, dan tips</span></span>
              <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-5 border-t border-white/[0.05] p-4 sm:p-5">
              <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
                <ActivityTimeline user={user} />
                <TutorialCard />
              </div>
              <RecentProjects active={active} canvasUrl={canvasUrl} />
              <div className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
                <QuickActions />
                <DailyTips />
              </div>
            </div>
          </details>

          <Footer />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, canvasLinks, onNavigate }: { user: PublicUser; canvasLinks: CanvasLinks; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex h-14 items-center gap-3 rounded-2xl px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-[0_10px_30px_rgba(245,185,66,0.22)]">
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold tracking-tight">DowaLabs</span>
          <span className="block text-[11px] text-slate-500">AI Product Studio</span>
        </span>
      </Link>

      <div className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Workspace</div>
      <nav aria-label="Navigasi dashboard" className="mt-3 grid gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard";
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
                isActive
                  ? "bg-gradient-to-r from-amber-300/[0.14] to-transparent font-medium text-white shadow-[inset_0_0_0_1px_rgba(245,185,66,0.12)]"
                  : "text-slate-400 hover:translate-x-0.5 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {isActive && <motion.span layoutId="dashboard-active-nav" className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,185,66,0.8)]" />}
              <Icon className={cn("h-[18px] w-[18px] transition-colors", isActive ? "text-amber-300" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Gemini Canvas</div>
      <nav aria-label="Gemini Canvas tools" className="mt-3 grid gap-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {CANVAS_TOOLS.map((tool) => {
          const Icon = canvasToolIcon(tool.key);
          const ready = user.canAccessCanvas && Boolean(canvasLinks[tool.key]);
          return (
            <button key={tool.key} type="button" onClick={() => launchCanvasTool(user.canAccessCanvas, canvasLinks, tool.key, tool.label)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
              <Icon className="h-4 w-4 text-slate-600 transition group-hover:text-amber-300" />
              <span className="truncate">{tool.label}</span>
              {ready ? <ExternalLink className="ml-auto h-3 w-3 text-slate-700 group-hover:text-amber-300" /> : <Lock className="ml-auto h-3 w-3 text-slate-700" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-[20px] border border-white/[0.07] bg-white/[0.035] p-3 transition hover:border-amber-300/20 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [&::-webkit-details-marker]:hidden">
            <Avatar name={user.name} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="mt-0.5 block truncate text-[11px] text-amber-300">{user.packageName.toUpperCase()} Member</span>
            </span>
            <MoreHorizontal className="h-4 w-4 text-slate-500" />
          </summary>
          <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-white/10 bg-[#101420] p-2 shadow-2xl">
            <div className="border-b border-white/10 px-3 py-2 text-xs text-slate-500">{user.email}</div>
            <LogoutButton variant="ghost" className="mt-1 w-full justify-start" />
          </div>
        </details>
      </div>
    </div>
  );
}

function TopBar({
  user,
  softTheme,
  onToggleTheme,
  onOpenSidebar,
}: {
  user: PublicUser;
  softTheme: boolean;
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
}) {
  const [search, setSearch] = useState("");

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = search.trim().toLowerCase();
    if (!query) return;
    if (query.includes("transfer") || query.includes("billing") || query.includes("invoice")) {
      window.location.assign("/payment");
      return;
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-dashboard-search]"));
    const target = sections.find((section) => section.dataset.dashboardSearch?.includes(query));
    if (target) {
      const disclosure = target.closest<HTMLDetailsElement>("#dashboard-more");
      if (disclosure) disclosure.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060914]/75 backdrop-blur-2xl">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 xl:px-10">
        <button type="button" onClick={onOpenSidebar} aria-label="Buka navigasi" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300 transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <form onSubmit={onSearch} role="search" className="relative max-w-lg flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari sesuatu di dashboard"
            placeholder="Cari sesuatu..."
            className="h-11 w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] pl-10 pr-16 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/10 focus:border-amber-300/30 focus:bg-white/[0.055] focus:ring-4 focus:ring-amber-300/[0.05]"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500 sm:block">⌘ K</kbd>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <details className="group relative">
            <summary aria-label="Notifikasi" className="relative grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [&::-webkit-details-marker]:hidden">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(245,185,66,0.7)]" />
            </summary>
            <div className="absolute right-0 top-12 w-72 rounded-2xl border border-white/10 bg-[#101420] p-4 shadow-2xl">
              <p className="text-sm font-medium">Notifikasi</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Tidak ada notifikasi baru. Semua aktivitas akun terlihat aman.</p>
            </div>
          </details>

          <button type="button" onClick={onToggleTheme} aria-label={softTheme ? "Gunakan mode gelap pekat" : "Gunakan mode gelap lembut"} aria-pressed={softTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:bg-white/[0.07] hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            {softTheme ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <details className="group relative hidden sm:block">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-transparent p-1.5 pr-2 text-left transition hover:border-white/[0.07] hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [&::-webkit-details-marker]:hidden">
              <Avatar name={user.name} compact />
              <span className="hidden max-w-28 truncate text-xs font-medium xl:block">{user.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/10 bg-[#101420] p-2 shadow-2xl">
              <div className="px-3 py-2"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"><UserRound className="h-4 w-4" />Profil</Link>
              <LogoutButton variant="ghost" className="w-full justify-start" />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function HeroBanner({ user, canvasUrl }: { user: PublicUser; canvasUrl: string | null }) {
  return (
    <motion.section
      data-dashboard-search="welcome hero canvas studio"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative isolate overflow-hidden rounded-[24px] border border-white/[0.07] bg-[linear-gradient(120deg,rgba(245,185,66,0.11),rgba(255,255,255,0.025)_42%,rgba(99,102,241,0.1))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6 xl:p-7"
    >
      <div aria-hidden="true" className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-amber-300/[0.08] blur-3xl" />
      <svg aria-hidden="true" viewBox="0 0 600 240" className="absolute inset-y-0 right-0 -z-10 h-full w-2/3 opacity-35 [mask-image:linear-gradient(to_left,black,transparent)]">
        <path d="M0 140 C120 20 210 250 340 110 S520 40 650 130" fill="none" stroke="rgba(245,185,66,.5)" strokeWidth="1" />
        <path d="M0 175 C120 55 240 275 360 135 S530 70 660 160" fill="none" stroke="rgba(129,140,248,.42)" strokeWidth="1" />
        <path d="M60 90 C170 -10 260 190 390 75 S560 15 680 105" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
      </svg>

      <div className="relative grid items-center gap-5 xl:grid-cols-[1fr_auto]">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <MembershipBadge status={user.membershipStatus} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs text-slate-300"><Clock3 className="h-3.5 w-3.5 text-amber-300" />{user.canAccessCanvas ? `${user.remainingDays} hari tersisa` : "Akses belum aktif"}</span>
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Creative workspace</p>
          <h1 className="mt-2 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl xl:text-[36px]">
            Selamat datang kembali, <span className="text-gradient-gold">{firstName(user.name)}</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Bangun visual produk yang lebih tajam, konsisten, dan siap jual dengan workspace AI DowaLabs.</p>
        </div>
        <div className="relative flex min-w-64 flex-col items-center gap-5 xl:items-end">
          <div className="[&>button]:h-12 [&>button]:rounded-2xl [&>button]:px-6 [&>button]:shadow-[0_14px_40px_rgba(245,185,66,0.18)]">
            <CanvasButton canAccess={user.canAccessCanvas} canvasUrl={canvasUrl} status={user.membershipStatus} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function StatsCards({ user }: { user: PublicUser }) {
  const stats: Array<{ label: string; value: string; note: string; icon: LucideIcon; tone: string }> = [
    { label: "Projects", value: "0", note: "Siap untuk project pertama", icon: FolderKanban, tone: "text-indigo-300 bg-indigo-400/10" },
    { label: "Generated Images", value: "0", note: "Mulai dari AI Studio", icon: Images, tone: "text-cyan-300 bg-cyan-400/10" },
    { label: "Membership", value: user.packageName.toUpperCase(), note: user.canAccessCanvas ? "Subscription aktif" : "Menunggu aktivasi", icon: Crown, tone: "text-amber-300 bg-amber-300/10" },
    { label: "Remaining Days", value: user.canAccessCanvas ? String(user.remainingDays) : "—", note: user.canAccessCanvas ? "Sebelum masa aktif habis" : "Aktif setelah verifikasi", icon: CalendarDays, tone: "text-emerald-300 bg-emerald-400/10" },
  ];

  return (
    <section data-dashboard-search="stats projects images membership" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.article key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} whileHover={{ y: -3 }} className="rounded-[20px] border border-white/[0.06] bg-white/[0.028] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-colors hover:border-white/10 hover:bg-white/[0.045]">
            <div className="flex items-start justify-between gap-4">
              <span className={cn("grid h-9 w-9 place-items-center rounded-xl", stat.tone)}><Icon className="h-4 w-4" /></span>
              <ArrowUpRight className="h-4 w-4 text-slate-700" />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-300">{stat.label}</p>
            <p className="mt-1.5 truncate text-[11px] text-slate-500">{stat.note}</p>
          </motion.article>
        );
      })}
    </section>
  );
}

function CanvasToolsGrid({ user, canvasLinks }: { user: PublicUser; canvasLinks: CanvasLinks }) {
  return (
    <section data-dashboard-search="gemini canvas tools product background color portrait prompt">
      <SectionHeading eyebrow="Gemini Canvas Suite" title="Creative AI Tools" description="Lima workspace khusus untuk mempercepat produksi visual Anda." />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {CANVAS_TOOLS.map((tool, index) => {
          const Icon = canvasToolIcon(tool.key);
          const ready = user.canAccessCanvas && Boolean(canvasLinks[tool.key]);
          return (
            <motion.button key={tool.key} type="button" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} whileHover={{ y: -3 }} onClick={() => launchCanvasTool(user.canAccessCanvas, canvasLinks, tool.key, tool.label)} className="group rounded-[20px] border border-white/[0.06] bg-white/[0.028] p-4 text-left shadow-[0_14px_35px_rgba(0,0,0,0.14)] transition-colors hover:border-amber-300/15 hover:bg-amber-300/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
              <div className="flex items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300/[0.08] text-amber-300"><Icon className="h-4 w-4" /></span>{ready ? <ExternalLink className="h-4 w-4 text-slate-700 group-hover:text-amber-300" /> : <Lock className="h-4 w-4 text-slate-700" />}</div>
              <h3 className="mt-3 text-sm font-semibold text-slate-200">{tool.label}</h3>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-slate-600">{tool.description}</p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function MembershipCard({ user }: { user: PublicUser }) {
  const progress = membershipProgress(user);
  return (
    <PremiumCard id="membership" search="membership plan subscription langganan" title="Membership" eyebrow="Current plan" icon={Crown}>
      <div className="mt-6 rounded-[20px] border border-amber-300/10 bg-gradient-to-br from-amber-300/[0.09] to-transparent p-5">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">{user.packageName.toUpperCase()} PLAN</p><p className="mt-2 text-2xl font-semibold">{user.canAccessCanvas ? `${user.remainingDays} hari` : "Belum aktif"}</p><p className="mt-1 text-xs text-slate-500">Sisa masa subscription</p></div>
          <MembershipBadge status={user.membershipStatus} />
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-200 shadow-[0_0_16px_rgba(245,185,66,0.4)]" />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>{Math.round(progress)}% tersisa</span><span>{user.canAccessCanvas ? "Active" : "Inactive"}</span></div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-5 before:absolute before:left-[calc(50%-1px)] before:top-2 before:h-8 before:w-px before:bg-white/10">
        <TimelineDate label="Joined date" value={formatDate(user.membershipStart || user.createdAt)} align="left" />
        <TimelineDate label="Expire date" value={formatDate(user.membershipEnd)} align="right" />
      </div>
      <Button asChild variant="outline" className="mt-6 w-full rounded-2xl border-white/10 bg-white/[0.025] hover:border-amber-300/20 hover:bg-amber-300/[0.06]">
        <Link href="/payment">Kelola Membership <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </PremiumCard>
  );
}

function AIStudioCard({ user, canvasUrl }: { user: PublicUser; canvasUrl: string | null }) {
  const features = [
    { label: "Studio", icon: Camera },
    { label: "Video", icon: Video },
    { label: "Lifestyle", icon: ImageIcon },
    { label: "Background Remove", icon: Eraser },
  ];
  return (
    <motion.section data-dashboard-search="ai studio canvas video lifestyle background" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative isolate min-h-[320px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.028] shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_45%,rgba(99,102,241,0.18),transparent_36%),radial-gradient(circle_at_15%_0%,rgba(245,185,66,0.08),transparent_30%)]" />
      <div className="grid h-full min-h-[320px] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-300"><WandSparkles className="h-5 w-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">DowaLabs Creative Engine</p><h2 className="mt-1 text-xl font-semibold sm:text-[22px]">AI Product Studio</h2></div></div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Satu workspace untuk mengubah foto produk menjadi aset campaign, video, dan visual lifestyle yang konsisten.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {features.map((feature) => { const Icon = feature.icon; return <div key={feature.label} className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-black/10 px-3 py-2 text-[11px] text-slate-300"><Icon className="h-3.5 w-3.5 text-amber-300" />{feature.label}</div>; })}
          </div>
          <div className="mt-auto pt-4 [&>button]:h-11 [&>button]:w-full [&>button]:rounded-xl sm:[&>button]:w-auto">
            <CanvasButton canAccess={user.canAccessCanvas} canvasUrl={canvasUrl} status={user.membershipStatus} />
          </div>
        </div>
        <div className="relative min-h-64 overflow-hidden border-t border-white/[0.06] lg:border-l lg:border-t-0">
          <Image src="/images/showcase/tshirt-after4.jpg" alt="Preview DowaLabs AI Product Studio" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-center transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e18] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl"><div><p className="text-xs font-medium">Product Studio</p><p className="text-[10px] text-slate-400">High fidelity output</p></div><span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-300 text-black"><Sparkles className="h-4 w-4" /></span></div>
        </div>
      </div>
    </motion.section>
  );
}

function ActivityTimeline({ user }: { user: PublicUser }) {
  const activities = [
    { title: "Login berhasil", detail: user.lastLoginAt ? formatDate(user.lastLoginAt) : "Sesi aktif", icon: CheckCircle2, complete: true },
    { title: user.canAccessCanvas ? "Membership aktif" : "Menunggu aktivasi", detail: user.canAccessCanvas ? `${user.remainingDays} hari tersisa` : "Selesaikan verifikasi pembayaran", icon: Crown, complete: user.canAccessCanvas },
    { title: "Akun DowaLabs dibuat", detail: formatDate(user.createdAt), icon: UserRound, complete: true },
    { title: "Generate image pertama", detail: "Belum ada aktivitas", icon: Images, complete: false },
    { title: "Video rendering", detail: "Belum dimulai", icon: Video, complete: false },
  ];
  return (
    <PremiumCard search="activity login history aktivitas" title="Recent Activity" eyebrow="Account timeline" icon={Activity}>
      <div className="mt-6 max-h-[310px] space-y-0 overflow-y-auto pr-2 [scrollbar-color:rgba(255,255,255,.12)_transparent] [scrollbar-width:thin]">
        {activities.map((item, index) => {
          const Icon = item.icon; return (
            <div key={item.title} className="relative flex gap-3 pb-6 last:pb-0">
              {index < activities.length - 1 && <span className="absolute left-[17px] top-9 h-[calc(100%-20px)] w-px bg-white/[0.07]" />}
              <span className={cn("relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl border", item.complete ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" : "border-white/[0.07] bg-white/[0.025] text-slate-600")}><Icon className="h-4 w-4" /></span>
              <div className="pt-0.5"><p className={cn("text-sm font-medium", item.complete ? "text-slate-200" : "text-slate-500")}>{item.title}</p><p className="mt-1 text-xs text-slate-600">{item.detail}</p></div>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}

function TutorialCard() {
  return (
    <PremiumCard id="tutorial" search="tutorial demo belajar video" title="Tutorial Pilihan" eyebrow="Learn the workflow" icon={BookOpen}>
      <div className="mt-6 grid gap-5 sm:grid-cols-[1.05fr_0.95fr]">
        <Link href="https://youtu.be/GopfhfPfPFI" target="blank" aria-label="Putar tutorial AI Product Studio" className="group relative min-h-56 overflow-hidden rounded-[20px] border border-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
          <Image src="/images/showcase/tshirt-after4.jpg" alt="Thumbnail tutorial AI Product Studio" fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/25" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-2xl backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-black"><Play className="ml-1 h-6 w-6 fill-current" /></span>
          <span className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-2 py-1 text-[10px] backdrop-blur">08:24</span>
        </Link>
        <div className="flex flex-col">
          <span className="w-fit rounded-full border border-indigo-400/15 bg-indigo-400/[0.08] px-2.5 py-1 text-[10px] font-medium text-indigo-300">BEGINNER</span>
          <h3 className="mt-4 text-xl font-semibold leading-snug">Membuat Visual Produk Pertama dengan AI</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Pelajari upload, prompt dasar, dan cara menghasilkan visual studio yang konsisten.</p>
          <div className="mt-auto pt-6"><div className="flex justify-between text-[11px] text-slate-500"><span>Progress</span><span>0%</span></div><div className="mt-2 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full w-0 rounded-full bg-amber-300" /></div><Button asChild variant="outline" className="mt-4 w-full rounded-2xl border-white/10"><Link href="/demo">Mulai Tutorial <ArrowRight className="h-4 w-4" /></Link></Button></div>
        </div>
      </div>
    </PremiumCard>
  );
}

function RecentProjects({ active, canvasUrl }: { active: boolean; canvasUrl: string | null }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const href = active && canvasUrl ? canvasUrl : "/payment";
  const external = href.startsWith("http");

  function toggleFavorite(index: number) {
    setFavorites((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }
  return (
    <section id="projects" data-dashboard-search="projects gallery recent project" className="scroll-mt-24">
      <SectionHeading eyebrow="Creative library" title="Recent Projects" description="Template workspace siap dipakai untuk memulai visual berikutnya." action={<a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="inline-flex items-center gap-2 text-xs font-medium text-amber-300 transition hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">Buka Studio <ArrowUpRight className="h-3.5 w-3.5" /></a>} />
      <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-color:rgba(255,255,255,.1)_transparent] [scrollbar-width:thin]">
        {PROJECTS.map((project, index) => (
          <motion.article key={project.name} whileHover={{ y: -5 }} className="group min-w-[250px] snap-start overflow-hidden rounded-[22px] border border-white/[0.06] bg-white/[0.025] transition-colors hover:border-amber-300/15 hover:bg-white/[0.04] sm:min-w-[280px]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src="/images/showcase/tshirt-after4.jpg" alt={`Thumbnail ${project.name}`} fill sizes="280px" style={{ objectPosition: project.position }} className="object-cover transition duration-700 group-hover:scale-110" />
              <div className={cn("absolute inset-0 mix-blend-soft-light", index % 3 === 0 ? "bg-indigo-500/20" : index % 3 === 1 ? "bg-amber-500/15" : "bg-cyan-500/15")} />
              <button type="button" aria-label={favorites.includes(index) ? `Hapus ${project.name} dari favorit` : `Favoritkan ${project.name}`} aria-pressed={favorites.includes(index)} onClick={() => toggleFavorite(index)} className={cn("absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/35 backdrop-blur-xl transition hover:scale-105 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300", favorites.includes(index) ? "text-rose-300" : "text-white/70")}><Heart className={cn("h-4 w-4", favorites.includes(index) && "fill-current")} /></button>
            </div>
            <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-medium">{project.name}</h3><p className="mt-1 text-xs text-slate-500">{project.type} · Template</p></div><span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-slate-500">0 images</span></div><a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">Open Project <ArrowRight className="h-3.5 w-3.5" /></a></div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <PremiumCard search="quick actions transfer tutorial billing history support settings" title="Quick Actions" eyebrow="Shortcuts" icon={WandSparkles}>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon; return action.disabled ? (
            <div key={action.label} aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 rounded-[18px] border border-white/[0.05] bg-white/[0.018] p-3.5 opacity-50"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-slate-400"><Icon className="h-[18px] w-[18px]" /></span><span><span className="block text-sm font-medium">{action.label}</span><span className="mt-0.5 block text-[11px] text-slate-600">{action.description}</span></span></div>
          ) : (
            <Link key={action.label} href={action.href} className="group flex items-center gap-3 rounded-[18px] border border-white/[0.05] bg-white/[0.018] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/15 hover:bg-amber-300/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-slate-400 transition group-hover:bg-amber-300/10 group-hover:text-amber-300"><Icon className="h-[18px] w-[18px]" /></span><span className="min-w-0"><span className="block text-sm font-medium">{action.label}</span><span className="mt-0.5 block truncate text-[11px] text-slate-600">{action.description}</span></span><ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-700 transition group-hover:text-amber-300" /></Link>
          );
        })}
      </div>
    </PremiumCard>
  );
}

function DailyTips() {
  return (
    <motion.section data-dashboard-search="tips daily help" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative isolate overflow-hidden rounded-[24px] border border-amber-300/10 bg-gradient-to-br from-amber-300/[0.09] via-white/[0.025] to-indigo-400/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
      <div aria-hidden="true" className="absolute -bottom-16 -right-16 -z-10 h-44 w-44 rounded-full border border-amber-300/10 bg-amber-300/[0.05]" />
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-black shadow-[0_12px_35px_rgba(245,185,66,0.22)]"><Lightbulb className="h-5 w-5" /></span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.17em] text-amber-300">Tips Hari Ini</p>
      <h2 className="mt-3 text-xl font-semibold leading-snug">Mulai dari background yang sederhana.</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">Gunakan background polos agar AI menghasilkan gambar produk yang lebih konsisten dan mudah diarahkan.</p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><Sparkles className="h-3.5 w-3.5 text-amber-300" />DowaLabs Creative Guide</div>
    </motion.section>
  );
}

function PremiumCard({ id, search, title, eyebrow, icon: Icon, children }: { id?: string; search: string; title: string; eyebrow: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <motion.section id={id} data-dashboard-search={search} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="scroll-mt-24 rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-colors hover:border-white/[0.09] sm:p-6">
      <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.05] bg-white/[0.035] text-amber-300"><Icon className="h-5 w-5" /></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">{eyebrow}</p><h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-[22px]">{title}</h2></div></div>
      {children}
    </motion.section>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2><p className="mt-2 text-sm text-slate-500">{description}</p></div>{action}</div>;
}

function TimelineDate({ label, value, align }: { label: string; value: string; align: "left" | "right" }) {
  return <div className={align === "right" ? "text-right" : "text-left"}><p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">{label}</p><p className="mt-2 text-xs font-medium text-slate-300">{value}</p></div>;
}

function Avatar({ name, compact = false }: { name: string; compact?: boolean }) {
  return <span className={cn("grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 font-semibold text-black shadow-[0_8px_24px_rgba(245,185,66,0.16)]", compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs")}>{initials(name)}</span>;
}

function AIOrb() {
  return <div aria-hidden="true" className="relative hidden h-28 w-28 place-items-center sm:grid"><motion.span animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-amber-300/25" /><motion.span animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-3 rounded-full border border-indigo-300/25" /><span className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-300/30 to-indigo-400/20 blur-md" /><span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-amber-200 shadow-[0_0_45px_rgba(245,185,66,0.14)] backdrop-blur-xl"><Sparkles className="h-6 w-6" /></span></div>;
}

function Footer() {
  return <footer className="flex flex-col gap-2 border-t border-white/[0.05] py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} DowaLabs. Creative AI workspace.</span><span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />All systems operational</span></footer>;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Creator";
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "DL";
}

function membershipProgress(user: PublicUser) {
  if (!user.canAccessCanvas || !user.membershipStart || !user.membershipEnd) return 0;
  const start = new Date(user.membershipStart).getTime();
  const end = new Date(user.membershipEnd).getTime();
  const now = Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.max(0, Math.min(100, ((end - now) / (end - start)) * 100));
}

function canvasToolIcon(key: CanvasToolKey) {
  return {
    productStudio: Camera,
    backgroundRemover: Eraser,
    colorGrading: Palette,
    portraitStyle: ImageIcon,
    promptAi: BookOpen,
  }[key];
}

function launchCanvasTool(
  canAccess: boolean,
  links: CanvasLinks,
  key: CanvasToolKey,
  label: string
) {
  if (!canAccess) {
    toast.error("Aktifkan membership untuk membuka tool ini.");
    return;
  }
  const url = links[key];
  if (!url) {
    toast.error(`Link ${label} belum diatur oleh admin.`);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
