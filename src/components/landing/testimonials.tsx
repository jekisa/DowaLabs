import { Quote, Star } from "lucide-react";
import { testimonials } from "@/components/landing/landing-data";

export function Testimonials() {
  return (
    <section id="testimonials" className="border-b border-white/[0.06] bg-[#080a12] py-12 sm:py-16">
      <div className="container">
        <div className="mb-7 max-w-2xl">
          <p className="eyebrow">Testimoni</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Dipakai untuk seller, affiliate, dan UMKM yang butuh visual lebih cepat
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Review berikut masih placeholder sampai data user asli tersedia.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.22)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <Quote className="h-5 w-5 text-amber-300" />
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold text-amber-200">
                  Placeholder
                </span>
              </div>
              <div className="mb-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                ))}
              </div>
              <p className="text-sm leading-6 text-slate-300">{item.quote}</p>
              <p className="mt-4 inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                {item.metric}
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-xs text-slate-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
