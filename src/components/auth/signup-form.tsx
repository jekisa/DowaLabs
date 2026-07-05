"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, Phone, UserRound } from "lucide-react";
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

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        value: 0,
        currency: "IDR",
      });
      facebookPixel.startTrial({
        content_name: "Pro onboarding",
        value: 0,
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
    <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-blue-950/30">
      <CardHeader>
        <CardTitle className="text-2xl">Buat Akun DowaLabs</CardTitle>
        <CardDescription>
          Isi data member lalu lanjutkan ke pembayaran paket Pro Rp29.900.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-2 rounded-[8px] border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <Field icon={<UserRound className="h-4 w-4" />} id="name" label="Name" placeholder="Nama kamu" />
          <Field icon={<Mail className="h-4 w-4" />} id="email" label="Email" type="email" placeholder="kamu@email.com" />
          <Field icon={<Phone className="h-4 w-4" />} id="whatsapp" label="WhatsApp" placeholder="08123456789" />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter kombinasi + angka"
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-amber-300/25 bg-amber-300/[0.08] p-4">
            <div>
              <p className="text-sm font-semibold text-white">Paket Pro</p>
              <p className="mt-1 text-xs text-slate-400">Semua fitur + 5.000 prompt</p>
            </div>
            <p className="font-semibold text-amber-300">Rp29.900</p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Membuat akun..." : "Daftar & Lanjut Payment"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-amber-300 hover:underline">
            Login di sini
          </Link>
        </p>
      </CardContent>
    </Card>
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
