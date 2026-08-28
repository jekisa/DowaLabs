"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Globe2, Sparkles } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthRedesign = ["/login", "/signup"].includes(usePathname());

  if (isAuthRedesign) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white px-6 py-4">
        <AuthTopBar />
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <Link
        href="/"
        className="relative mb-8 flex items-center gap-2 font-bold"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="text-xl tracking-tight">{BRAND_NAME}</span>
      </Link>

      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

/* Deliberately not the marketing <Navbar />: that one is a dark, full-width bar
   with product links that pull attention off the form. This is the minimum a
   signed-out visitor needs — a way back and a way to switch language. */
function AuthTopBar() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="mx-auto mb-3 flex w-full max-w-[1600px] items-center justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {language === "id" ? "Kembali ke beranda" : "Back to home"}
      </Link>

      <div
        className="flex items-center gap-1 rounded-[9px] border border-slate-200 bg-white px-1 py-1"
        aria-label={language === "id" ? "Bahasa" : "Language"}
      >
        <Globe2 className="ml-2 h-[18px] w-[18px] text-slate-400" />
        {(["id", "en"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            aria-label={item === "id" ? "Bahasa Indonesia" : "English"}
            aria-pressed={language === item}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
              language === item && "bg-primary text-primary-foreground hover:text-primary-foreground"
            )}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
