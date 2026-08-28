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
import { MEMBERSHIP_DAYS, PRO_PRICE } from "@/lib/membership";
import { PRO_PRICE_LABEL } from "@/components/landing/landing-data";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { useLanguage } from "@/lib/language";
import { FieldError, fieldErrorsFrom, type FieldErrors } from "@/components/auth/field-error";

// Mirrors validators.ts: password min 8 / max 72, whatsapp normalized to 8-15
// digits. The pattern stays looser than the server (it allows +, spaces, dashes
// and parens, which normalizeWhatsapp strips) so the browser never blocks input
// the API would have accepted.
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;
// Parens and the dash are escaped because `pattern` compiles with the `v` flag
// in current Chrome, where they are reserved inside a character class.
const WHATSAPP_PATTERN = "[0-9+\\(\\)\\s\\-]{8,20}";

const copy = {
  id: {
    title: "Buat akun DowaLabs",
    subtitle: "Daftar dan lanjutkan ke pembayaran untuk mengaktifkan seluruh tool DowaLabs.",
    name: "Nama",
    namePlaceholder: "Nama kamu",
    email: "Email",
    emailPlaceholder: "kamu@email.com",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "08123456789",
    whatsappHint: "Gunakan format 08xxxx atau +62xxxx.",
    password: "Password",
    passwordPlaceholder: `Minimal ${PASSWORD_MIN} karakter kombinasi + angka`,
    planName: "Paket Pro",
    planDetail: `Semua fitur + 5.000+ prompt · ${MEMBERSHIP_DAYS} hari akses`,
    submit: "Daftar & Lanjut Payment",
    submitting: "Membuat akun...",
    haveAccount: "Sudah punya akun?",
    login: "Login di sini",
    showPassword: "Tampilkan password",
    hidePassword: "Sembunyikan password",
    genericError: "Signup gagal. Periksa data lalu coba lagi.",
    networkError: "Tidak dapat terhubung ke server.",
  },
  en: {
    title: "Create your DowaLabs account",
    subtitle: "Sign up and continue to payment to unlock every DowaLabs tool.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "08123456789",
    whatsappHint: "Use the 08xxxx or +62xxxx format.",
    password: "Password",
    passwordPlaceholder: `At least ${PASSWORD_MIN} characters with a number`,
    planName: "Pro Plan",
    planDetail: `Every tool + 5,000 prompts · ${MEMBERSHIP_DAYS} days of access`,
    submit: "Sign up & continue to payment",
    submitting: "Creating account...",
    haveAccount: "Already have an account?",
    login: "Log in here",
    showPassword: "Show password",
    hidePassword: "Hide password",
    genericError: "Signup failed. Check your details and try again.",
    networkError: "Could not reach the server.",
  },
};

export function SignupForm() {
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
        // `details` is the zod field->message map from api.ts; it used to be
        // dropped, leaving "Data tidak valid" as the only clue on a 422.
        setFieldErrors(fieldErrorsFrom(payload.details));
        setError(payload.error || text.genericError);
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
      setError(text.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-[1600px] items-stretch gap-3 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4">
      <section className="flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[460px]">
          <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-slate-900"><span className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-white"><Image src="/images/brand/dowa-logo.png" alt="DowaLabs logo" fill sizes="36px" className="object-cover" /></span><span className="text-lg">DowaLabs</span></Link>
          <Card className="border-0 bg-transparent shadow-none"><CardHeader className="p-0"><CardTitle className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{text.title}</CardTitle><CardDescription className="mt-3 text-base text-slate-500">{text.subtitle}</CardDescription></CardHeader><CardContent className="mt-7 p-0">
            <form onSubmit={onSubmit} className="space-y-4">
              {error && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
              <Field icon={<UserRound className="h-4 w-4" />} id="name" label={text.name} placeholder={text.namePlaceholder} error={fieldErrors.name} minLength={2} maxLength={80} />
              <Field icon={<Mail className="h-4 w-4" />} id="email" label={text.email} type="email" autoComplete="email" placeholder={text.emailPlaceholder} error={fieldErrors.email} />
              <Field icon={<Phone className="h-4 w-4" />} id="whatsapp" label={text.whatsapp} type="tel" autoComplete="tel" placeholder={text.whatsappPlaceholder} error={fieldErrors.whatsapp} pattern={WHATSAPP_PATTERN} title={text.whatsappHint} />
              <div className="space-y-2"><Label htmlFor="password">{text.password}</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={PASSWORD_MIN} maxLength={PASSWORD_MAX} placeholder={text.passwordPlaceholder} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "password-error" : undefined} className="h-12 rounded-lg border-slate-200 px-9 text-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200" required /><button type="button" aria-label={showPassword ? text.hidePassword : text.showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div><FieldError id="password-error" message={fieldErrors.password} /></div>
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-[#fdfaf4] p-4 text-slate-900 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">{text.planName}</p><p className="mt-1 text-xs text-slate-600">{text.planDetail}</p></div><p className="font-semibold text-slate-900">{PRO_PRICE_LABEL}</p></div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? text.submitting : text.submit}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">{text.haveAccount} <Link href="/login" className="font-medium text-slate-900 hover:underline">{text.login}</Link></p>
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
  error,
  ...inputProps
}: {
  icon: React.ReactNode;
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
} & Omit<React.ComponentProps<typeof Input>, "id" | "name" | "type" | "placeholder">) {
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
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 rounded-lg border-slate-200 pl-9 text-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200"
          required
          {...inputProps}
        />
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
