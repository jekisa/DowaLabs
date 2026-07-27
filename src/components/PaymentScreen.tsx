"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock3, CreditCard, Loader2, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PublicUser } from "@/lib/serialize";
import type { SerializedPaymentInvoice } from "@/lib/payment-invoice";
import { cn, formatDate, formatIDR } from "@/lib/utils";
import { UserAreaShell } from "@/components/dashboard/user-area-shell";
import type { CanvasLinks } from "@/lib/canvas-tools";
import { trackMetaEventOnce } from "@/lib/facebookPixel";

interface PaymentSettings {
  proPrice: number;
  dokuConfigured: boolean;
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
  initialInvoices: SerializedPaymentInvoice[];
}) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [creatingDuitku, setCreatingDuitku] = useState(false);

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

  function replaceInvoice(invoice: SerializedPaymentInvoice) {
    setInvoices((current) => {
      const exists = current.some((item) => item.id === invoice.id);
      return exists
        ? current.map((item) => (item.id === invoice.id ? invoice : item))
        : [invoice, ...current];
    });
  }

  async function payWithDoku() {
    setCreatingDuitku(true);
    try {
      const response = await fetch("/api/payments/duitku/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: "pro" }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        toast.error(payload.error || "Gagal membuat checkout Duitku");
        return;
      }

      const invoice = payload.invoice as SerializedPaymentInvoice;
      replaceInvoice(invoice);
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

      window.location.href = payload.paymentUrl;
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setCreatingDuitku(false);
    }
  }

  return (
    <UserAreaShell
      user={user}
      canvasLinks={settings.canvasLinks}
      title="Pembayaran"
      eyebrow="Billing & Subscription"
    >
      <div className="relative mb-8 overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(120deg,rgba(245,185,66,0.11),rgba(255,255,255,0.025)_45%,rgba(99,102,241,0.1))] p-7 shadow-[0_32px_100px_rgba(0,0,0,0.28)] sm:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
          Duitku Checkout
        </p>
        <h1 className="relative mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Pembayaran Subscription
        </h1>
        <p className="relative mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Bayar lewat Hosted Payment Page Duitku. Akses Pro aktif otomatis setelah pembayaran berhasil dikonfirmasi.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-3">
            <ReceiptText className="h-5 w-5 text-amber-300" />
            <h2 className="font-semibold">Paket Pro</h2>
          </div>
          <div className="mt-4 rounded-[20px] border border-amber-300/35 bg-amber-300/[0.09] p-4 shadow-[0_12px_35px_rgba(245,185,66,0.07)]">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Pro</span>
              <CheckCircle2 className="h-5 w-5 text-amber-300" />
            </div>
            <p className="mt-2 text-xl font-semibold text-amber-300">
              {formatIDR(settings.proPrice)}{" "}
              <span className="text-xs font-normal text-slate-400">/ 30 hari</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Semua tool premium dan 5.000 prompt siap pakai.
            </p>
          </div>
          <Button
            className="mt-4 w-full rounded-2xl"
            size="lg"
            disabled={creatingDuitku || !settings.dokuConfigured}
            onClick={payWithDoku}
          >
            {creatingDuitku ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {creatingDuitku ? "Membuka Duitku..." : "Bayar via Duitku"}
          </Button>
          {!settings.dokuConfigured && (
            <p className="mt-3 text-sm text-red-300">Duitku belum dikonfigurasi oleh admin.</p>
          )}
        </section>

        <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-7">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-amber-300" />
            <h2 className="font-semibold">Riwayat Pembayaran</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="mt-5 flex min-h-40 items-center justify-center rounded-[20px] border border-dashed border-white/15 bg-black/10 p-6 text-center text-sm text-slate-400">
              Belum ada invoice Duitku.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {invoices.slice(0, 8).map((invoice) => (
                <div
                  key={invoice.id}
                  className="rounded-[18px] border border-white/[0.06] bg-black/10 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(invoice.createdAt)} / {formatIDR(invoice.amount)}
                      </p>
                    </div>
                    <Badge variant={statusVariant[invoice.status]}>{invoice.statusLabel}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-2">
                    <Detail label="Paket" value={`${invoice.packageName.toUpperCase()} / ${invoice.durationDays} hari`} />
                    <Detail label="Batas pembayaran" value={formatDateTime(invoice.expiresAt)} />
                  </div>
                  {invoice.status === "approved" && (
                    <div className="mt-4 rounded-[16px] border border-emerald-400/20 bg-emerald-400/[0.08] p-3 text-sm text-emerald-100">
                      <p className="font-semibold">Pembayaran berhasil</p>
                      <p className="mt-1">Subscription aktif sampai {formatDate(invoice.subscriptionEnd)}.</p>
                      <Button asChild className="mt-3" size="sm">
                        <Link href="/dashboard">Buka Dashboard</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </UserAreaShell>
  );
}

function Detail({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={cn("mt-1 break-all font-medium", highlight && "text-lg text-amber-300")}>
        {value}
      </p>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
