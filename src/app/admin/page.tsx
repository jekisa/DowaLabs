import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock3,
  CreditCard,
  Receipt,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { ManualPayment } from "@/models/ManualPayment";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectToDatabase();
  const [total, active, pending, expired, blocked, payments, unprocessed] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ membershipStatus: "active" }),
      User.countDocuments({ membershipStatus: "pending" }),
      User.countDocuments({ membershipStatus: "expired" }),
      User.countDocuments({ membershipStatus: "blocked" }),
      ManualPayment.countDocuments({}),
      ManualPayment.countDocuments({ status: "waiting_verification" }),
    ]);
  return { total, active, pending, expired, blocked, payments, unprocessed };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();
  const activeRate = stats.total ? Math.round((stats.active / stats.total) * 100) : 0;
  const primaryCards = [
    { label: "Total Users", value: stats.total, note: "Semua akun terdaftar", icon: Users, tone: "text-indigo-300 bg-indigo-400/10" },
    { label: "Active Members", value: stats.active, note: `${activeRate}% dari total user`, icon: UserCheck, tone: "text-emerald-300 bg-emerald-400/10" },
    { label: "Total Invoice", value: stats.payments, note: "Seluruh pembayaran", icon: Receipt, tone: "text-cyan-300 bg-cyan-400/10" },
    { label: "Perlu Verifikasi", value: stats.unprocessed, note: "Menunggu tindakan admin", icon: AlertTriangle, tone: "text-amber-300 bg-amber-300/10" },
  ];

  return (
    <div className="space-y-8">
      <section className="relative isolate overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(120deg,rgba(245,185,66,0.11),rgba(255,255,255,0.025)_42%,rgba(99,102,241,0.1))] p-7 shadow-[0_32px_100px_rgba(0,0,0,0.28)] sm:p-9">
        <div className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Control Center</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">DowaLabs Admin Overview</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Pantau kesehatan membership, invoice, dan pembayaran manual dari satu workspace yang terorganisir.</p>
          </div>
          <Link href="/admin/payments" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-6 text-sm font-semibold text-black shadow-[0_14px_40px_rgba(245,185,66,0.2)] transition hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            <ShieldCheck className="h-4 w-4" /> Verifikasi Transfer
            {stats.unprocessed > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-[10px] text-white">{stats.unprocessed}</span>}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {primaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="group rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.045]">
              <div className="flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${card.tone}`}><Icon className="h-5 w-5" /></span><Activity className="h-4 w-4 text-slate-700" /></div>
              <p className="mt-5 text-3xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-300">{card.label}</p>
              <p className="mt-2 text-xs text-slate-600">{card.note}</p>
            </article>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-7">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Membership health</p><h2 className="mt-2 text-xl font-semibold">Status Distribution</h2></div><span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-1 text-xs text-emerald-300">{activeRate}% active</span></div>
          <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${activeRate}%` }} /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatusMini label="Pending" value={stats.pending} icon={Clock3} tone="text-amber-300 bg-amber-300/10" />
            <StatusMini label="Expired" value={stats.expired} icon={UserX} tone="text-slate-300 bg-slate-300/10" />
            <StatusMini label="Blocked" value={stats.blocked} icon={UserX} tone="text-red-300 bg-red-300/10" />
          </div>
        </section>

        <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quick management</p>
          <h2 className="mt-2 text-xl font-semibold">Admin Shortcuts</h2>
          <div className="mt-5 space-y-2">
            <QuickLink href="/admin/users" label="Kelola Users" description="Status dan masa aktif" icon={Users} />
            <QuickLink href="/admin/payments" label="Verifikasi Transfer" description="Bukti pembayaran manual" icon={CreditCard} />
            <QuickLink href="/admin/settings" label="Application Settings" description="Rekening, harga, dan Canvas" icon={Receipt} />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusMini({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Clock3; tone: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-black/10 p-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></span><div><p className="text-lg font-semibold">{value}</p><p className="text-[11px] text-slate-600">{label}</p></div></div>;
}

function QuickLink({ href, label, description, icon: Icon }: { href: string; label: string; description: string; icon: typeof Users }) {
  return <Link href={href} className="group flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-black/10 p-3 transition hover:border-amber-300/15 hover:bg-amber-300/[0.035]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] text-slate-400 group-hover:text-amber-300"><Icon className="h-[18px] w-[18px]" /></span><div><p className="text-sm font-medium">{label}</p><p className="mt-0.5 text-[11px] text-slate-600">{description}</p></div><ArrowRight className="ml-auto h-4 w-4 text-slate-700 group-hover:text-amber-300" /></Link>;
}
