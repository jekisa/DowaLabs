import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BRAND_NAME, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg">{BRAND_NAME}</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            AI Product Studio untuk membuat foto produk affiliate lebih
            menarik, premium, dan siap jual.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Navigasi</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Akun</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/login" className="hover:text-foreground">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-foreground">
                Daftar
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND_NAME}. Seluruh hak cipta
          dilindungi.
        </p>
      </div>
    </footer>
  );
}
