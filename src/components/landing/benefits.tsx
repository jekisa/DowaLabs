import {
  Eraser,
  ImagePlus,
  Layers3,
  MessageSquareText,
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
];

export function Benefits() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article
            key={feature.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300/10 text-amber-300">
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
