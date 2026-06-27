import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05060b]">
      <div className="container grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-gradient-to-br from-amber-200 to-amber-500 text-black">
              <Sparkles className="h-5 w-5" />
            </span>
            DowaLabs
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Membership website untuk seller, affiliate, dan UMKM yang ingin
            membuat visual produk lebih premium dengan bantuan AI.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Navigasi</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <Link href="/demo" className="hover:text-white">Demo</Link>
            <Link href="/#fitur" className="hover:text-white">Fitur</Link>
            <Link href="/pricing" className="hover:text-white">Harga</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Akun</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/signup" className="hover:text-white">Daftar</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        Copyright {new Date().getFullYear()} DowaLabs. All rights reserved.
      </div>
    </footer>
  );
}
