import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
