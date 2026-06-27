"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Phone, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlan = useMemo(
    () => (params.get("plan") === "pro" ? "pro" : "basic"),
    [params]
  );
  const [plan, setPlan] = useState<"basic" | "pro">(initialPlan);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/payment?plan=${plan}`);
  }

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-blue-950/30">
      <CardHeader>
        <CardTitle className="text-2xl">Buat Akun DowaLabs</CardTitle>
        <CardDescription>
          Isi data member, pilih paket, lalu lanjutkan ke halaman pembayaran.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field icon={<UserRound className="h-4 w-4" />} id="name" label="Name" placeholder="Nama kamu" />
          <Field icon={<Mail className="h-4 w-4" />} id="email" label="Email" type="email" placeholder="kamu@email.com" />
          <Field icon={<Phone className="h-4 w-4" />} id="whatsapp" label="WhatsApp" placeholder="08123456789" />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Pilih paket</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["basic", "pro"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPlan(option)}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition",
                    plan === option
                      ? "border-amber-300 bg-amber-300/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25"
                  )}
                >
                  <span className="block font-semibold capitalize">{option}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {option === "basic" ? "Rp19.000 / bulan" : "Rp35.000 / bulan"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Daftar & Lanjut Payment
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
