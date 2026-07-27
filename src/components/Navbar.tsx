"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe2, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
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
  const { language, setLanguage } = useLanguage();
  const text = copy[language];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05060b]/80 backdrop-blur-2xl">
      <div className="container flex h-[68px] max-w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="DowaLabs home">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-[#05060b] shadow-lg shadow-blue-500/20">
            <Image
              src="/images/brand/dowa-logo.png"
              alt="DowaLabs logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-normal">DowaLabs</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {text.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-slate-400 transition-colors hover:text-white",
                pathname === item.href && "text-amber-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-9 items-center gap-1 rounded-[8px] border border-white/10 bg-white/[0.04] px-1" aria-label={text.language}>
            <Globe2 className="ml-2 h-4 w-4 text-slate-400" />
            {(["id", "en"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-semibold text-slate-400 transition hover:text-white",
                  language === item && "bg-amber-300 text-[#120c03] hover:text-[#120c03]"
                )}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              {text.login}
            </Link>
          </Button>
          <Button asChild size="sm" className="px-4">
            <Link href="/signup">
              {text.start}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] md:hidden"
          aria-label={text.openMenu}
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
              className="fixed inset-0 z-50 bg-black/70 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 h-dvh w-[min(88vw,360px)] border-l border-white/10 bg-[#090d1c] p-5 shadow-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-[#05060b]">
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5"
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
                    className="block rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-2">
                <span className="flex items-center gap-2 px-2 text-sm font-medium text-slate-300">
                  <Globe2 className="h-4 w-4" />
                  {text.language}
                </span>
                <div className="flex gap-1">
                  {(["id", "en"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLanguage(item)}
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
    </header>
  );
}
