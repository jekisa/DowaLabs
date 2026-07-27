import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05060b]">
      <div className="container grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-[#05060b] shadow-lg shadow-blue-500/20">
              <Image
                src="/images/brand/dowa-logo.png"
                alt="DowaLabs logo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
            DowaLabs
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            AI Product Studio untuk seller, affiliate, dan UMKM yang ingin
            membuat foto produk siap jual dengan cepat.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Navigasi</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <Link href="/demo" className="hover:text-white">Demo</Link>
            <Link href="/#examples" className="hover:text-white">Examples</Link>
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
        <div>
          <h3 className="text-sm font-semibold text-white">Kontak</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <a href="mailto:dowatech889@gmail.com" className="break-all hover:text-white">
              dowatech889@gmail.com
            </a>
            <a href="https://wa.me/6282297382109" target="_blank" rel="noreferrer" className="hover:text-white">
              0822 9738 2109
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} DowaLabs. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
