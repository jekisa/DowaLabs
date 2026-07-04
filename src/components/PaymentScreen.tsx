"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  FileCheck2,
  Loader2,
  ReceiptText,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { PublicUser } from "@/lib/serialize";
import type { SerializedManualPayment } from "@/lib/manual-payment";
import { cn, formatDate, formatIDR } from "@/lib/utils";
import { UserAreaShell } from "@/components/dashboard/user-area-shell";
import type { CanvasLinks } from "@/lib/canvas-tools";
import { trackMetaEventOnce } from "@/lib/facebookPixel";

interface PaymentSettings {
  proPrice: number;
  bankConfigured: boolean;
  canvasLinks: CanvasLinks;
}

const statusVariant = {
  pending_payment: "warning",
  waiting_verification: "warning",
  processing: "warning",
  approved: "success",
  rejected: "destructive",
  expired: "secondary",
} as const;

export function PaymentScreen({
  user,
  settings,
  initialInvoices,
}: {
  user: PublicUser;
  settings: PaymentSettings;
  initialInvoices: SerializedManualPayment[];
}) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedId, setSelectedId] = useState(initialInvoices[0]?.id ?? null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proof, setProof] = useState<File | null>(null);
  const [transferAccountName, setTransferAccountName] = useState("");
  const [userNote, setUserNote] = useState("");
  const proofInputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => invoices.find((invoice) => invoice.id === selectedId) ?? invoices[0] ?? null,
    [invoices, selectedId]
  );

  useEffect(() => {
    const approvedInvoice = invoices.find((invoice) => {
      if (invoice.status !== "approved" || !invoice.reviewedAt) return false;
      const reviewedAt = new Date(invoice.reviewedAt).getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return Number.isFinite(reviewedAt) && Date.now() - reviewedAt <= sevenDays;
    });

    if (!approvedInvoice) return;

    trackMetaEventOnce(
      `purchase:${approvedInvoice.id}`,
      "Purchase",
      {
        content_name: "Paket Pro",
        content_ids: [approvedInvoice.packageName],
        content_type: "product",
        value: approvedInvoice.amount,
        currency: approvedInvoice.currency,
        num_items: 1,
      },
      { eventId: `purchase-${approvedInvoice.id}` }
    );
  }, [invoices]);

  function replaceInvoice(invoice: SerializedManualPayment) {
    setInvoices((current) => {
      const exists = current.some((item) => item.id === invoice.id);
      return exists
        ? current.map((item) => (item.id === invoice.id ? invoice : item))
        : [invoice, ...current];
    });
    setSelectedId(invoice.id);
  }

  async function createInvoice() {
    setCreating(true);
    try {
      const response = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: "pro" }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        toast.error(payload.error || "Gagal membuat invoice");
        return;
      }
      const invoice = payload.invoice as SerializedManualPayment;
      replaceInvoice(invoice);
      if (!payload.reused) {
        trackMetaEventOnce(
          `checkout:${invoice.id}`,
          "InitiateCheckout",
          {
            content_name: "Paket Pro",
            content_ids: [invoice.packageName],
            content_type: "product",
            value: invoice.amount,
            currency: invoice.currency,
            num_items: 1,
          },
          { eventId: `checkout-${invoice.id}` }
        );
      }
      toast.success(payload.message || "Invoice berhasil dibuat");
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setCreating(false);
    }
  }

  async function uploadProof(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !proof) {
      toast.error("Pilih file bukti transfer terlebih dahulu");
      return;
    }
    const form = new FormData();
    form.set("proof", proof);
    form.set("transferAccountName", transferAccountName);
    form.set("userNote", userNote);

    setUploading(true);
    try {
      const response = await fetch(`/api/payments/manual/${selected.id}/proof`, {
        method: "POST",
        body: form,
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        toast.error(payload.error || "Gagal mengunggah bukti transfer");
        return;
      }
      const invoice = payload.invoice as SerializedManualPayment;
      const isFirstProof = !selected.hasProof;
      replaceInvoice(invoice);
      if (isFirstProof) {
        trackMetaEventOnce(
          `payment-info:${invoice.id}`,
          "AddPaymentInfo",
          {
            content_name: "Transfer Bank Paket Pro",
            content_ids: [invoice.packageName],
            content_type: "product",
            value: invoice.amount,
            currency: invoice.currency,
          },
          { eventId: `payment-info-${invoice.id}` }
        );
      }
      setProof(null);
      if (proofInputRef.current) proofInputRef.current.value = "";
      toast.success(payload.message);
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setUploading(false);
    }
  }

  async function copyAccountNumber(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Nomor rekening disalin");
  }

  const awaitingReview =
    selected?.status === "waiting_verification" || selected?.status === "processing";
  const canUpload =
    selected && ["pending_payment", "waiting_verification", "rejected"].includes(selected.status);

  return (
    <UserAreaShell user={user} canvasLinks={settings.canvasLinks} title="Transfer Bank" eyebrow="Billing & Subscription">
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(120deg,rgba(245,185,66,0.11),rgba(255,255,255,0.025)_45%,rgba(99,102,241,0.1))] p-7 shadow-[0_32px_100px_rgba(0,0,0,0.28)] sm:p-9">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Manual Bank Transfer</p>
          <h1 className="relative mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Pembayaran Subscription</h1>
          <p className="relative mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Buat invoice, transfer tepat sesuai nominal, lalu unggah bukti. Akses aktif setelah admin memverifikasi pembayaran.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-3"><ReceiptText className="h-5 w-5 text-amber-300" /><h2 className="font-semibold">1. Paket Pro</h2></div>
              <div className="mt-4 rounded-[20px] border border-amber-300/35 bg-amber-300/[0.09] p-4 shadow-[0_12px_35px_rgba(245,185,66,0.07)]">
                <div className="flex items-center justify-between"><span className="font-semibold">Pro</span><CheckCircle2 className="h-5 w-5 text-amber-300" /></div>
                <p className="mt-2 text-xl font-semibold text-amber-300">{formatIDR(settings.proPrice)} <span className="text-xs font-normal text-slate-400">/ 30 hari</span></p>
                <p className="mt-2 text-xs text-slate-400">Semua tool premium dan 5.000 prompt siap pakai.</p>
              </div>
              <Button className="mt-4 w-full rounded-2xl" size="lg" disabled={creating || awaitingReview || !settings.bankConfigured} onClick={createInvoice}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4" />}
                {creating ? "Membuat invoice..." : "Buat Invoice"}
              </Button>
              {!settings.bankConfigured && <p className="mt-3 text-sm text-red-300">Rekening perusahaan belum diatur oleh admin.</p>}
            </section>

            {invoices.length > 0 && (
              <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
                <h2 className="font-semibold">Riwayat invoice</h2>
                <div className="mt-4 space-y-2">
                  {invoices.slice(0, 8).map((invoice) => (
                    <button key={invoice.id} onClick={() => setSelectedId(invoice.id)} className={cn("flex w-full items-center justify-between gap-3 rounded-[16px] border p-3.5 text-left text-sm transition-all", selected?.id === invoice.id ? "border-amber-300/30 bg-amber-300/[0.08]" : "border-white/[0.06] bg-black/10 hover:border-white/15 hover:bg-white/[0.025]")}>
                      <div><p className="font-medium">{invoice.invoiceNumber}</p><p className="mt-1 text-xs text-slate-400">{formatDate(invoice.createdAt)} · {formatIDR(invoice.amount)}</p></div>
                      <Badge variant={statusVariant[invoice.status]}>{invoice.statusLabel}</Badge>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            {!selected ? (
              <section className="flex min-h-64 items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.025] p-8 text-center text-slate-400">
                Buat invoice Pro untuk melihat instruksi transfer.
              </section>
            ) : (
              <>
                <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-xs uppercase tracking-widest text-slate-400">Invoice</p><h2 className="mt-1 text-xl font-semibold">{selected.invoiceNumber}</h2></div>
                    <Badge variant={statusVariant[selected.status]}>{selected.statusLabel}</Badge>
                  </div>
                  <div className="mt-5 grid gap-4 border-y border-white/10 py-5 sm:grid-cols-2">
                    <Detail label="Paket" value={`${selected.packageName.toUpperCase()} · ${selected.durationDays} hari`} />
                    <Detail label="Total transfer" value={formatIDR(selected.amount)} highlight />
                    <Detail label="Dibuat" value={formatDateTime(selected.createdAt)} />
                    <Detail label="Batas pembayaran" value={formatDateTime(selected.expiresAt)} />
                  </div>

                  <div className="mt-5 rounded-[20px] border border-blue-400/15 bg-blue-400/[0.07] p-5">
                    <div className="flex items-center gap-2 text-blue-200"><Building2 className="h-5 w-5" /><p className="font-semibold">Rekening tujuan</p></div>
                    <div className="mt-4 space-y-3 text-sm">
                      <Detail label="Bank" value={selected.bankName} />
                      <Detail label="Atas nama" value={selected.bankAccountHolder} />
                      <div className="flex items-end justify-between gap-3"><Detail label="Nomor rekening" value={selected.bankAccountNumber} highlight /><Button size="sm" variant="outline" onClick={() => copyAccountNumber(selected.bankAccountNumber)}><Copy className="h-4 w-4" />Salin</Button></div>
                    </div>
                  </div>

                  {selected.status === "approved" && (
                    <div className="mt-5 rounded-[18px] border border-emerald-400/20 bg-emerald-400/[0.08] p-4 text-sm text-emerald-100">
                      <div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0" /><div><p className="font-semibold">Pembayaran disetujui</p><p className="mt-1">Subscription aktif sampai {formatDate(selected.subscriptionEnd)}.</p><Button asChild className="mt-3" size="sm"><Link href="/dashboard">Buka Dashboard</Link></Button></div></div>
                    </div>
                  )}
                  {awaitingReview && (
                    <div className="mt-5 rounded-[18px] border border-amber-300/20 bg-amber-300/[0.08] p-4 text-sm text-amber-100">
                      <div className="flex gap-3"><Clock3 className="h-5 w-5 shrink-0" /><div><p className="font-semibold">Bukti sedang diverifikasi</p><p className="mt-1">Admin akan mencocokkan nama pengirim, nominal, dan bukti transfer.</p>{selected.hasProof && <Button asChild size="sm" variant="outline" className="mt-3"><a href={`/api/payments/manual/${selected.id}/proof`} target="_blank" rel="noreferrer"><FileCheck2 className="h-4 w-4" />Lihat Bukti</a></Button>}</div></div>
                    </div>
                  )}
                  {selected.status === "rejected" && (
                    <div className="mt-5 rounded-[18px] border border-red-400/20 bg-red-400/[0.08] p-4 text-sm text-red-100"><p className="font-semibold">Bukti ditolak</p><p className="mt-1">{selected.adminNote || "Silakan periksa bukti dan unggah ulang."}</p></div>
                  )}
                </section>

                {canUpload && (
                  <form onSubmit={uploadProof} className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-7">
                    <div className="flex items-center gap-3"><UploadCloud className="h-5 w-5 text-amber-300" /><div><h2 className="font-semibold">2. Upload bukti transfer</h2><p className="text-xs text-slate-400">PNG, JPG, WEBP, atau PDF · maksimal 4 MB</p></div></div>
                    <div className="mt-5 space-y-4">
                      <div className="space-y-2"><Label htmlFor="transferAccountName">Nama pemilik rekening pengirim</Label><Input className="h-12 rounded-2xl border-white/[0.07] bg-black/10" id="transferAccountName" value={transferAccountName} onChange={(event) => setTransferAccountName(event.target.value)} placeholder="Nama sesuai rekening pengirim" required minLength={2} maxLength={100} /></div>
                      <div className="space-y-2"><Label htmlFor="proof">File bukti transfer</Label><Input className="h-12 rounded-2xl border-white/[0.07] bg-black/10" ref={proofInputRef} id="proof" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setProof(event.target.files?.[0] ?? null)} required /></div>
                      <div className="space-y-2"><Label htmlFor="userNote">Catatan (opsional)</Label><Textarea className="min-h-28 rounded-2xl border-white/[0.07] bg-black/10" id="userNote" value={userNote} onChange={(event) => setUserNote(event.target.value)} maxLength={500} placeholder="Contoh: transfer dari rekening pasangan" /></div>
                      <Button type="submit" size="lg" className="w-full rounded-2xl" disabled={uploading}>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}{uploading ? "Mengunggah..." : selected.hasProof ? "Upload Ulang Bukti" : "Kirim Bukti Transfer"}</Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
    </UserAreaShell>
  );
}

function Detail({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div><p className="text-xs text-slate-400">{label}</p><p className={cn("mt-1 break-all font-medium", highlight && "text-lg text-amber-300")}>{value}</p></div>;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
