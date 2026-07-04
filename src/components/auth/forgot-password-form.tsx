"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
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

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.error || "Tautan reset belum dapat dikirim.");
        return;
      }
      setMessage(payload.message);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-blue-950/30">
      <CardHeader>
        <CardTitle className="text-2xl">Lupa password</CardTitle>
        <CardDescription>
          Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat
          password baru.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="space-y-5">
            <div className="flex gap-3 rounded-[8px] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Periksa email Anda</p>
                <p className="mt-1 text-emerald-100/80">{message}</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4" /> Kembali ke login
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-[8px] border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email akun</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="recovery-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  className="pl-9"
                  required
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Mengirim..." : "Kirim tautan reset"}
            </Button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke login
            </Link>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
