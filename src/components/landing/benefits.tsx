import {
  Eraser,
  ImagePlus,
  Layers3,
  MessageSquareText,
  Palette,
  Rocket,
} from "lucide-react";

const features = [
  {
    title: "AI Product Photo",
    description: "Ubah foto biasa menjadi visual produk yang siap dipakai untuk jualan.",
    icon: ImagePlus,
  },
  {
    title: "Background Remover",
    description: "Bersihkan latar produk agar mudah dipakai di berbagai materi promosi.",
    icon: Eraser,
  },
  {
    title: "Ganti Background",
    description: "Tempatkan produk dalam suasana baru tanpa perlu melakukan foto ulang.",
    icon: Layers3,
  },
  {
    title: "Prompt Affiliate Siap Pakai",
    description: "Mulai lebih cepat dengan prompt terarah untuk konten affiliate harian.",
    icon: MessageSquareText,
  },
  {
    title: "Style Campaign",
    description: "Buat variasi visual untuk katalog, iklan, dan konten sosial media.",
    icon: Palette,
  },
  {
    title: "Posting Lebih Cepat",
    description: "Hemat waktu produksi konten tanpa harus sewa studio atau foto ulang.",
    icon: Rocket,
  },
];

export function Benefits() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article
            key={feature.title}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:border-amber-300/25 hover:bg-white/[0.055]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300/10 text-amber-300 ring-1 ring-amber-300/10">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{feature.description}</p>
          </article>
        );
      })}
    </div>
  );
}
