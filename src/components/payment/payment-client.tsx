"use client";

import { useState } from "react";
import { ExternalLink, MessageCircle, Info, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MembershipBadge } from "@/components/membership-badge";
import type { PublicUser } from "@/lib/serialize";
import { formatIDR, buildWhatsappLink, cn } from "@/lib/utils";

interface SettingsData {
  lynkBasicUrl: string;
  lynkProUrl: string;
  adminWhatsapp: string;
  basicPrice: number;
  proPrice: number;
}

export function PaymentClient({
  user,
  settings,
}: {
  user: PublicUser;
  settings: SettingsData;
}) {
  const [pkg, setPkg] = useState<"basic" | "pro">(
    user.packageName === "pro" ? "pro" : "basic"
  );

  const price = pkg === "pro" ? settings.proPrice : settings.basicPrice;
  const lynkUrl = pkg === "pro" ? settings.lynkProUrl : settings.lynkBasicUrl;

  const waMessage = `Halo admin DowaLabs, saya sudah bayar.

Nama: ${user.name}
Email akun: ${user.email}
Nomor WhatsApp: ${user.whatsapp}
Paket: ${pkg}
Order ID Lynk:
Bukti pembayaran saya kirim di chat ini.`;

  const waLink = buildWhatsappLink(settings.adminWhatsapp, waMessage);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Selesaikan Pembayaran</h1>
        <p className="mt-2 text-muted-foreground">
          Pilih paket dan lakukan pembayaran via Lynk.id untuk mengaktifkan
          akses DowaLabs AI Canvas.
        </p>
      </div>

      {user.membershipStatus === "active" ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-5">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="font-medium">Akun kamu sudah aktif 🎉</p>
              <p className="text-sm text-muted-foreground">
                Kamu bisa langsung membuka dashboard dan AI Canvas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between py-5">
            <div>
              <p className="text-sm text-muted-foreground">Status akun</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <MembershipBadge status={user.membershipStatus} />
          </CardContent>
        </Card>
      )}

      {/* Package selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        {(["basic", "pro"] as const).map((option) => {
          const optionPrice =
            option === "pro" ? settings.proPrice : settings.basicPrice;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setPkg(option)}
              className={cn(
                "rounded-xl border p-5 text-left transition-all",
                pkg === option
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-input hover:border-white/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold capitalize">{option}</span>
                {pkg === option && (
                  <CheckCircle2 className="h-5 w-5 text-gold-400" />
                )}
              </div>
              <p className="mt-1 text-2xl font-bold">
                {formatIDR(optionPrice)}
                <span className="text-sm font-normal text-muted-foreground">
                  /bulan
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {option === "basic"
                  ? "Akses dashboard, Canvas, tutorial dasar"
                  : "Semua fitur Basic + prompt & preset premium"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Paket {pkg === "pro" ? "Pro" : "Basic"}</CardTitle>
          <CardDescription>
            Total pembayaran: {formatIDR(price)} untuk 30 hari akses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {lynkUrl ? (
            <Button asChild size="lg" className="w-full">
              <a href={lynkUrl} target="_blank" rel="noopener noreferrer">
                Bayar via Lynk <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button size="lg" className="w-full" disabled>
              Link pembayaran belum tersedia
            </Button>
          )}

          {settings.adminWhatsapp ? (
            <Button asChild size="lg" variant="outline" className="w-full">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Kirim Bukti ke WhatsApp
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="glass rounded-xl p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Instruksi Pembayaran</p>
            <p>
              Setelah pembayaran berhasil, akun akan aktif otomatis jika webhook
              berhasil. Jika belum aktif dalam beberapa menit, kirim bukti
              pembayaran ke WhatsApp admin untuk aktivasi manual.
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Pilih paket Basic atau Pro di atas.</li>
              <li>Klik “Bayar via Lynk” dan selesaikan pembayaran.</li>
              <li>Tunggu aktivasi otomatis, atau kirim bukti ke WhatsApp.</li>
              <li>Login kembali dan buka dashboard kamu.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
