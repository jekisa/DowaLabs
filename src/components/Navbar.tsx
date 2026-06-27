"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, LogIn, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Demo", href: "/demo" },
  { label: "Fitur", href: "/#fitur" },
  { label: "Harga", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05060b]/80 backdrop-blur-2xl">
      <div className="container flex h-[68px] max-w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="DowaLabs home">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-[8px] bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-[#090704] shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-normal">DowaLabs</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
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
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button asChild size="sm" className="px-4">
            <Link href="/signup">
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] md:hidden"
          aria-label="Buka menu"
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
              aria-label="Tutup menu"
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
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  DowaLabs
                </Link>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5"
                  aria-label="Tutup menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-2">
                {navItems.map((item) => (
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

              <div className="mt-8 grid gap-3">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" />
                    Mulai Sekarang
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
