"use client";

import { CheckCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const feedback = [
  ["Rina", "Kak hasil fotonya bagus banget, langsung saya pakai buat Shopee.", "Terima kasih kak, semoga jualannya makin lancar."],
  ["Kevin", "Background-nya bersih, upload produk jadi jauh lebih cepat.", "Senang bisa bantu ya kak."],
  ["Aulia", "Variasi kontennya ngebantu banget buat promo.", "Kalau mau versi lain bisa saya bantu juga."],
];

export function FeedbackChatStack() {
  const reduced = useReducedMotion();
  return (
    // one vertical thread in a narrow column: the customer bubble hangs left,
    // the DowaLabs reply hangs right, so it reads like a real chat log.
    <div className="relative z-20 flex w-full flex-col gap-3 md:gap-4">
      {feedback.map(([label, message, reply], index) => (
        <motion.div
          key={label}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.1 }}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">{label[0]}</span><span className="text-xs font-semibold text-slate-700">{label}</span></div>
          <div className="mr-6 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3 py-2 text-sm leading-5 text-slate-900 md:py-2.5 shadow-sm">
            <p>{message}</p>
            <span className="mt-1 block text-right text-[11px] text-slate-400">03:19</span>
          </div>
          <div className="ml-6 rounded-2xl rounded-tr-md border border-black/[0.06] bg-[#DCF8C6] px-3 py-2 text-sm leading-5 text-[#111827] md:py-2.5 shadow-sm">
            <p>{reply}</p>
            <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-slate-500">09:24 <CheckCheck className="h-3.5 w-3.5 text-teal-600" /></span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
