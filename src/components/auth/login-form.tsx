"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { motion } from "framer-motion";
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
import { useLanguage } from "@/lib/language";
import { FieldError, fieldErrorsFrom, type FieldErrors } from "@/components/auth/field-error";

const copy = {
  id: {
    title: "Selamat datang kembali",
    subtitle: "Masuk untuk melanjutkan ke workspace DowaLabs.",
    email: "Email",
    emailPlaceholder: "kamu@email.com",
    password: "Password",
    passwordPlaceholder: "Minimal 8 karakter",
    forgot: "Lupa password?",
    submit: "Masuk",
    submitting: "Memproses...",
    noAccount: "Belum punya akun?",
    signup: "Daftar",
    showPassword: "Tampilkan password",
    hidePassword: "Sembunyikan password",
    genericError: "Email atau password salah.",
    networkError: "Tidak dapat terhubung ke server.",
  },
  en: {
    title: "Welcome back",
    subtitle: "Sign in to continue to your DowaLabs workspace.",
    email: "Email",
    emailPlaceholder: "you@email.com",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    forgot: "Forgot password?",
    submit: "Sign in",
    submitting: "Processing...",
    noAccount: "No account yet?",
    signup: "Sign up",
    showPassword: "Show password",
    hidePassword: "Hide password",
    genericError: "Wrong email or password.",
    networkError: "Could not reach the server.",
  },
};

export function LoginForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = copy[language];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        // `details` is the zod field->message map from api.ts; it used to be
        // dropped, leaving "Data tidak valid" as the only clue on a 422.
        setFieldErrors(fieldErrorsFrom(payload.details));
        setError(payload.error || text.genericError);
        return;
      }
      router.push(payload.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError(text.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-[1600px] items-stretch gap-3 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-10 lg:self-center lg:px-14">
        <div className="mx-auto w-full max-w-[460px]">
          <Link href="/" className="mb-10 flex items-center gap-2 font-semibold text-slate-900">
            <span className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-white"><Image src="/images/brand/dowa-logo.png" alt="DowaLabs logo" fill sizes="36px" className="object-cover" /></span>
            <span className="text-lg">DowaLabs</span>
          </Link>
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{text.title}</CardTitle>
              <CardDescription className="mt-3 text-base text-slate-500">{text.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="mt-8 p-0">
              <form onSubmit={onSubmit} className="space-y-5">
                {error && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email">{text.email}</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="email" name="email" type="email" autoComplete="email" placeholder={text.emailPlaceholder} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} className="h-12 rounded-lg border-slate-200 pl-9 text-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200" required />
                  </div>
                  <FieldError id="email-error" message={fieldErrors.email} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">{text.password}</Label>
                    <Link href="/forgot-password" className="text-sm text-slate-600 transition hover:text-slate-950">{text.forgot}</Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder={text.passwordPlaceholder} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "password-error" : undefined} className="h-12 rounded-lg border-slate-200 px-9 text-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200" required />
                    <button type="button" aria-label={showPassword ? text.hidePassword : text.showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  <FieldError id="password-error" message={fieldErrors.password} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? text.submitting : text.submit}</Button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-500">{text.noAccount} <Link href="/signup" className="font-medium text-slate-900 hover:underline">{text.signup}</Link></p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
      <AuthShowcase />
    </main>
  );
}
