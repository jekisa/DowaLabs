"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";
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

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.error || "Password belum dapat diperbarui.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-blue-950/30">
      <CardHeader>
        <CardTitle className="text-2xl">Buat password baru</CardTitle>
        <CardDescription>
          Gunakan minimal 8 karakter yang tidak mudah ditebak.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-5">
            <div className="flex gap-3 rounded-[8px] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Password berhasil diperbarui. Semua sesi lama telah dikeluarkan.
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/login">Login dengan password baru</Link>
            </Button>
          </div>
        ) : !token ? (
          <div className="space-y-5">
            <div className="flex gap-2 rounded-[8px] border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Tautan reset tidak lengkap atau tidak valid.
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/forgot-password">Minta tautan baru</Link>
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
            <PasswordField id="password" label="Password baru" />
            <PasswordField id="confirmPassword" label="Ulangi password baru" />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Menyimpan..." : "Simpan password baru"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function PasswordField({ id, label }: { id: string; label: string }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          className="px-9"
          minLength={8}
          maxLength={72}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
