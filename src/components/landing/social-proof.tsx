import { Star } from "lucide-react";
import { socialProof } from "@/components/landing/landing-data";

export function SocialProof() {
  return (
    <section className="border-b border-white/[0.06] bg-[#080a12] py-6">
      <div className="container grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]">
          <ProofStat value={socialProof.generatedImages} label="gambar digenerate" />
          <ProofStat value={socialProof.activeUsers} label="user aktif" />
          <ProofStat value={socialProof.rating} label="rating awal" icon />
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {socialProof.logos.map((logo) => (
            <span
              key={logo}
              className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofStat({ value, label, icon = false }: { value: string; label: string; icon?: boolean }) {
  return (
    <div className="border-r border-white/10 px-4 py-3 last:border-r-0">
      <p className="flex items-center gap-1.5 text-lg font-semibold text-white">
        {icon && <Star className="h-4 w-4 fill-amber-300 text-amber-300" />}
        {value}
      </p>
      <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">{label}</p>
    </div>
  );
}
