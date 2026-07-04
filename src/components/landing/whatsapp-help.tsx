"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buildWhatsappLink } from "@/lib/utils";
import { normalizeWhatsapp } from "@/lib/whatsapp";

const DEFAULT_QUESTIONS = [
  "Saya ingin tahu lebih lanjut tentang DowaLabs AI Product Studio.",
  "Bagaimana cara berlangganan Paket Pro?",
  "Fitur apa saja yang tersedia dalam Paket Pro?",
  "Saya mengalami kendala saat mendaftar atau melakukan pembayaran.",
];

export function WhatsappHelp({ number }: { number: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const whatsappNumber = normalizeWhatsapp(number);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-5 right-4 z-50 flex flex-col items-end sm:bottom-7 sm:right-7"
    >
      {open && (
        <section
          id="whatsapp-help-panel"
          role="dialog"
          aria-label="Hubungi admin melalui WhatsApp"
          className="mb-3 w-[calc(100vw-2rem)] max-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e18]/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4 bg-[#1fa855] px-5 py-4 text-white">
            <div className="flex gap-3">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">Tanya Admin DowaLabs</p>
                <p className="mt-0.5 text-xs text-white/80">
                  Biasanya membalas secepatnya
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Tutup bantuan WhatsApp"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4">
            <p className="mb-3 text-sm leading-6 text-slate-300">
              Halo! Pilih pertanyaan di bawah untuk langsung terhubung dengan
              admin kami.
            </p>
            <div className="space-y-2">
              {DEFAULT_QUESTIONS.map((question) => (
                <a
                  key={question}
                  href={buildWhatsappLink(
                    whatsappNumber,
                    `Halo Admin DowaLabs, ${question}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-sm leading-5 text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <MessageCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{question}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="whatsapp-help-panel"
        aria-label={open ? "Tutup bantuan WhatsApp" : "Tanya admin via WhatsApp"}
        className="group flex h-14 items-center gap-2.5 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-[#062d18] shadow-lg shadow-emerald-950/40 transition hover:-translate-y-0.5 hover:bg-[#38e477] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060b] sm:h-16 sm:px-5"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">Tanya Admin</span>
      </button>
    </div>
  );
}
