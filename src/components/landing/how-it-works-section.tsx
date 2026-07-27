import { Download, MousePointer2, Upload } from "lucide-react";
import { howItWorks } from "@/components/landing/landing-data";

const icons = [Upload, MousePointer2, Download];

export function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="border-b border-white/[0.06] bg-[#05060b] py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Cara kerja</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Dari foto seadanya ke konten siap posting dalam 3 langkah
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Alur dibuat sederhana untuk seller online shop yang butuh konten cepat tanpa bolak-balik briefing desain.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {howItWorks.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                key={item.step}
                className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.24)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">{item.step}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/10 text-amber-300 ring-1 ring-amber-300/10">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
