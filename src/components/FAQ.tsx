"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const items = [
  {
    q: "Apakah ini aplikasi AI?",
    a: "DowaLabs adalah membership gateway untuk mengakses workflow AI Product Studio dan Canvas yang membantu membuat visual produk lebih siap jual.",
  },
  {
    q: "Apakah harus bayar dulu?",
    a: "Kamu bisa daftar akun dulu. Akses Canvas aktif setelah memilih paket dan pembayaran diverifikasi.",
  },
  {
    q: "Bagaimana cara akses setelah bayar?",
    a: "Login ke dashboard, cek status membership, lalu klik tombol Buka DowaLabs AI Canvas.",
  },
  {
    q: "Apakah akun langsung aktif?",
    a: "Unggah bukti transfer pada halaman pembayaran. Admin akan memeriksa bukti dan mengaktifkan subscription setelah transfer terverifikasi.",
  },
  {
    q: "Kalau pembayaran belum aktif bagaimana?",
    a: "Buka halaman Transfer Bank, pilih invoice yang ditolak, baca catatan admin, lalu unggah bukti yang benar.",
  },
  {
    q: "Apakah bisa dipakai untuk Shopee affiliate?",
    a: "Bisa. Prompt dan alurnya dibuat untuk konten affiliate marketplace, seller, reseller, dan UMKM.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-glow py-20 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            Sebelum mulai, ini yang perlu kamu tahu
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Informasi singkat tentang akses, pembayaran, dan penggunaan DowaLabs.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-3">
          {items.map((item, index) => (
            <motion.details
              key={item.q}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group glass rounded-[8px] p-5 transition-colors open:border-white/20 open:bg-white/[0.06] sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                <span>{item.q}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/[0.05] text-slate-400 transition-transform group-open:rotate-45 group-open:text-amber-300">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 max-w-3xl border-t border-white/[0.08] pt-4 text-sm leading-7 text-slate-400">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
