"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function Footer() {
  const { language } = useLanguage();
  const isId = language === "id";
  const links = isId
    ? [["Fitur", "/#features"], ["Contoh", "/#examples"], ["Demo", "/demo"], ["Harga", "/#pricing"], ["FAQ", "/#faq"]]
    : [["Features", "/#features"], ["Examples", "/#examples"], ["Demo", "/demo"], ["Pricing", "/#pricing"], ["FAQ", "/#faq"]];

  return (
    <footer className="border-t border-white/10 bg-[#0b1220] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-[1.2fr_1fr_auto_auto] md:gap-10 md:px-8 md:py-9">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm"><Image src="/images/brand/dowa-logo.png" alt="DowaLabs logo" fill sizes="32px" className="object-cover" /></span>
            DowaLabs
          </Link>
          <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-300">{isId ? "Creative AI tools untuk membuat visual lebih cepat dan siap digunakan." : "Creative AI tools for faster, production-ready visuals."}</p>
        </div>

        <nav aria-label={isId ? "Navigasi footer" : "Footer navigation"} className="grid grid-cols-2 gap-x-8 gap-y-2 text-[15px] md:pt-1">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-slate-300 transition hover:text-white">{label}</Link>)}
        </nav>

        <div className="text-[15px] text-slate-300 md:pt-1">
          <p className="mb-3 font-medium text-white">{isId ? "Akun" : "Account"}</p>
          <Link href="/login" className="block transition hover:text-white">{isId ? "Masuk" : "Login"}</Link>
          <Link href="/signup" className="mt-2 block transition hover:text-white">{isId ? "Daftar" : "Sign up"}</Link>
        </div>

        <div className="text-[15px] text-slate-300 md:pt-1">
          <p className="mb-3 font-medium text-white">{isId ? "Hubungi kami" : "Contact us"}</p>
          <a href="mailto:dowatech889@gmail.com" className="group flex items-center gap-2 transition hover:text-white"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-100 transition group-hover:border-white/20 group-hover:bg-white/15"><Mail size={15} /></span><span className="break-all">dowatech889@gmail.com</span></a>
          <a href="tel:+6282297382109" className="group mt-2 flex items-center gap-2 transition hover:text-white"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-100 transition group-hover:border-white/20 group-hover:bg-white/15"><Phone size={15} /></span>0822 9738 2109</a>
          <a href="https://wa.me/6282297382109" target="_blank" rel="noreferrer" className="group mt-2 flex items-center gap-2 transition hover:text-white"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-300 transition group-hover:bg-emerald-300/20"><MessageCircle size={15} /></span>WhatsApp</a>
        </div>
      </div>

      <div className="border-t border-white/10">
        {/* pb clears the fixed sticky-CTA + WhatsApp bubble, which otherwise sit
            on top of this row once the page is scrolled to the bottom. */}
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 pb-24 pt-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>© {new Date().getFullYear()} DowaLabs. All rights reserved.</span>
          <Link href="/terms" className="transition hover:text-amber-200">{isId ? "Syarat & Ketentuan" : "Terms & Conditions"}</Link>
        </div>
      </div>
    </footer>
  );
}
