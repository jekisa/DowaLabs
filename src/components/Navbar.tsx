"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe2, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const copy = {
  id: {
    navItems: [
      { label: "Contoh", href: "/#examples" },
      { label: "Harga", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
    login: "Masuk",
    start: "Mulai",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    language: "Bahasa",
  },
  en: {
    navItems: [
      { label: "Examples", href: "/#examples" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
    login: "Login",
    start: "Start Now",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const text = copy[language];

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 16);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1220]/95 px-3 py-2.5 text-white backdrop-blur-md">
      <div className={cn("relative mx-auto w-full rounded-full border transition-[background-color,border-color,box-shadow,border-radius] duration-300 md:w-fit md:max-w-[calc(100vw-32px)]", open ? "rounded-2xl" : "rounded-full", scrolled ? "border-white/20 bg-[#0b1220] shadow-[0_10px_35px_rgba(15,23,42,.22)]" : "border-white/10 bg-[#0b1220]/90 shadow-[0_8px_30px_rgba(15,23,42,.16)]")}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:h-[68px] md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="DowaLabs home">
          <span className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm md:h-[34px] md:w-[34px]">
            <Image
              src="/images/brand/dowa-logo.png"
              alt="DowaLabs logo"
              fill
              sizes="34px"
              className="object-cover"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-normal text-white">DowaLabs</span>
        </Link>

        <nav className="hidden items-center gap-6 md:ml-8 md:flex">
          {text.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative py-2 text-[15px] font-medium text-slate-300 transition-colors duration-200 hover:text-white",
                pathname === item.href && "text-amber-300"
              )}
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-300 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:ml-8 md:flex">
          <div className="flex h-11 items-center gap-1 rounded-[9px] border border-white/10 bg-white/[0.04] px-1" aria-label={text.language}>
            <Globe2 className="ml-2 h-[18px] w-[18px] text-slate-400" />
            {(["id", "en"] as const).map((item) => (
          <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                aria-label={item === "id" ? "Bahasa Indonesia" : "English"}
                aria-pressed={language === item}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-300 transition hover:text-white",
                  language === item && "bg-amber-300 text-[#120c03] hover:text-[#120c03]"
                )}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm" className="h-11 px-3 text-[15px] text-slate-200 hover:bg-white/10 hover:text-white">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              {text.login}
            </Link>
          </Button>
          <Button asChild size="sm" className="h-11 px-5 text-[15px] transition-transform duration-200 hover:-translate-y-px">
            <Link href="/signup">
              {text.start}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.06] transition hover:border-amber-300/30 hover:bg-white/[0.1] md:hidden"
          aria-label={text.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
              <motion.button
              type="button"
              aria-label={text.closeMenu}
              className="fixed inset-0 z-40 bg-slate-900/10 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              id="mobile-menu"
              className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[calc(100dvh-96px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_14px_40px_rgba(15,23,42,.12)] backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <span className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-white">
                    <Image
                      src="/images/brand/dowa-logo.png"
                      alt="DowaLabs logo"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                  DowaLabs
                </Link>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100"
                  aria-label={text.closeMenu}
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-2">
                {text.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2">
                <span className="flex items-center gap-2 px-2 text-sm font-medium text-slate-600">
                  <Globe2 className="h-4 w-4" />
                  {text.language}
                </span>
                <div className="flex gap-1">
                  {(["id", "en"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLanguage(item)}
                      aria-label={item === "id" ? "Bahasa Indonesia" : "English"}
                      aria-pressed={language === item}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-semibold text-slate-400",
                        language === item && "bg-amber-300 text-[#120c03]"
                      )}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    {text.login}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" />
                    {text.start}
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
