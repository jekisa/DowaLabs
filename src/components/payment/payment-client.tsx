"use client";

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
import { formatIDR, buildWhatsappLink } from "@/lib/utils";

interface SettingsData {
  lynkProUrl: string;
  adminWhatsapp: string;
  proPrice: number;
}

export function PaymentClient({
  user,
  settings,
}: {
  user: PublicUser;
  settings: SettingsData;
}) {
  const waMessage = `Halo admin DowaLabs, saya sudah bayar.

Nama: ${user.name}
Email akun: ${user.email}
Nomor WhatsApp: ${user.whatsapp}
Paket: Pro
Order ID Lynk:
Bukti pembayaran saya kirim di chat ini.`;
  const waLink = buildWhatsappLink(settings.adminWhatsapp, waMessage);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Selesaikan Pembayaran</h1>
        <p className="mt-2 text-muted-foreground">
          Aktifkan paket Pro untuk mengakses DowaLabs AI Canvas.
        </p>
      </div>

      {user.membershipStatus === "active" ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-5">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="font-medium">Akun kamu sudah aktif</p>
              <p className="text-sm text-muted-foreground">Kamu bisa langsung membuka dashboard dan AI Canvas.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between py-5">
            <div><p className="text-sm text-muted-foreground">Status akun</p><p className="font-medium">{user.name}</p></div>
            <MembershipBadge status={user.membershipStatus} />
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl border border-primary bg-primary/10 p-5 shadow-lg shadow-primary/10">
        <div className="flex items-center justify-between"><span className="font-semibold">Paket Pro</span><CheckCircle2 className="h-5 w-5 text-gold-400" /></div>
        <p className="mt-1 text-2xl font-bold">{formatIDR(settings.proPrice)}<span className="text-sm font-normal text-muted-foreground">/30 hari</span></p>
        <p className="mt-2 text-xs text-muted-foreground">Semua tool premium + 5.000 prompt produk.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paket Pro</CardTitle>
          <CardDescription>Total pembayaran: {formatIDR(settings.proPrice)} untuk 30 hari akses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.lynkProUrl ? (
            <Button asChild size="lg" className="w-full"><a href={settings.lynkProUrl} target="_blank" rel="noopener noreferrer">Bayar via Lynk <ExternalLink className="h-4 w-4" /></a></Button>
          ) : (
            <Button size="lg" className="w-full" disabled>Link pembayaran belum tersedia</Button>
          )}
          {settings.adminWhatsapp && (
            <Button asChild size="lg" variant="outline" className="w-full"><a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Kirim Bukti ke WhatsApp</a></Button>
          )}
        </CardContent>
      </Card>

      <div className="glass rounded-xl p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Instruksi Pembayaran</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Klik Bayar via Lynk dan selesaikan pembayaran.</li>
              <li>Tunggu aktivasi otomatis, atau kirim bukti ke WhatsApp.</li>
              <li>Login kembali dan buka dashboard kamu.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
