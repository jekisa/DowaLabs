"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, Phone, UserRound, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { facebookPixel } from "@/lib/facebookPixel";
import { PRO_PRICE } from "@/lib/membership";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          whatsapp: form.get("whatsapp"),
          password: form.get("password"),
          packageName: "pro",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.error || "Signup gagal. Periksa data lalu coba lagi.");
        return;
      }
      facebookPixel.completeRegistration({
        content_name: "Paket Pro",
        status: true,
        value: PRO_PRICE,
        currency: "IDR",
      });
      facebookPixel.startTrial({
        content_name: "Pro onboarding",
        value: PRO_PRICE,
        currency: "IDR",
      });
      router.push("/payment");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100svh-24px)] w-full max-w-6xl items-stretch gap-3 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4">
      <section className="flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[460px]">
          <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-slate-900"><span className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-white"><Image src="/images/brand/dowa-logo.png" alt="DowaLabs logo" fill sizes="36px" className="object-cover" /></span><span className="text-lg">DowaLabs</span></Link>
          <Card className="border-0 bg-transparent shadow-none"><CardHeader className="p-0"><CardTitle className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Buat akun DowaLabs</CardTitle><CardDescription className="mt-3 text-base text-slate-500">Daftar dan lanjutkan ke pembayaran untuk mengaktifkan seluruh tool DowaLabs.</CardDescription></CardHeader><CardContent className="mt-7 p-0">
            <form onSubmit={onSubmit} className="space-y-4">
              {error && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
              <Field icon={<UserRound className="h-4 w-4" />} id="name" label="Name" placeholder="Nama kamu" />
              <Field icon={<Mail className="h-4 w-4" />} id="email" label="Email" type="email" placeholder="kamu@email.com" />
              <Field icon={<Phone className="h-4 w-4" />} id="whatsapp" label="WhatsApp" placeholder="08123456789" />
              <div className="space-y-2"><Label htmlFor="password" className="text-slate-700">Password</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter kombinasi + angka" className="h-12 rounded-lg border-slate-200 px-9 text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-slate-200" required /><button type="button" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-[#f8fafc] p-4 text-slate-900"><div><p className="text-sm font-semibold">Paket Pro</p><p className="mt-1 text-xs text-slate-500">Semua fitur + 5.000+ prompt · 30 hari akses</p></div><p className="font-semibold text-slate-900">Rp99.000</p></div>
              <Button type="submit" className="h-12 w-full rounded-lg bg-[#111111] text-white hover:bg-[#1F2937]" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Membuat akun..." : "Daftar & Lanjut Payment"}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <Link href="/login" className="font-medium text-slate-900 hover:underline">Login di sini</Link></p>
          </CardContent></Card>
        </div>
      </section>
      <AuthShowcase />
    </main>
  );
}

function Field({
  icon,
  id,
  label,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          className="pl-9"
          required
        />
      </div>
    </div>
  );
}
