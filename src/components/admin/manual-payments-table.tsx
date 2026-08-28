"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Eye, Filter, Loader2, ReceiptText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SerializedManualPayment } from "@/lib/manual-payment";
import { formatDate, formatIDR } from "@/lib/utils";

interface ManualPaymentRow extends SerializedManualPayment {
  user: {
    name: string;
    email: string;
    whatsapp: string;
  } | null;
}

const statusVariant = {
  pending_payment: "warning",
  waiting_verification: "warning",
  processing: "warning",
  approved: "success",
  rejected: "destructive",
  expired: "secondary",
} as const;

export function ManualPaymentsTable({ initialPayments }: { initialPayments: ManualPaymentRow[] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "waiting_verification" | "approved" | "rejected">("all");
  const [adminNote, setAdminNote] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const [processing, setProcessing] = useState<"approve" | "reject" | null>(null);
  const viewing = payments.find((payment) => payment.id === viewingId) ?? null;
  const filtered = useMemo(
    () => payments.filter((payment) => filter === "all" || payment.status === filter),
    [filter, payments]
  );

  function open(payment: ManualPaymentRow) {
    setViewingId(payment.id);
    setAdminNote(payment.adminNote || "");
    setDurationMonths(Math.max(1, Math.round(payment.durationDays / 30)));
  }

  async function review(action: "approve" | "reject") {
    if (!viewing) return;
    setProcessing(action);
    try {
      const response = await fetch(`/api/admin/manual-payments/${viewing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminNote,
          durationMonths: action === "approve" ? durationMonths : undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        toast.error(payload.error || "Gagal memverifikasi pembayaran");
        return;
      }
      setPayments((current) =>
        current.map((payment) =>
          payment.id === viewing.id
            ? { ...payment, ...payload.invoice, user: payment.user }
            : payment
        )
      );
      setViewingId(null);
      toast.success(payload.message);
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 rounded-[24px] border border-white/[0.06] bg-white/[0.028] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <span className="mr-1 inline-flex items-center gap-2 px-2 text-xs text-slate-500"><Filter className="h-4 w-4 text-amber-300" />Filter</span>
        {([
          ["all", "Semua"],
          ["waiting_verification", "Perlu Verifikasi"],
          ["approved", "Disetujui"],
          ["rejected", "Ditolak"],
        ] as const).map(([value, label]) => (
          <Button key={value} size="sm" variant={filter === value ? "default" : "outline"} className="rounded-xl" onClick={() => setFilter(value)}>
            {label}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-white/[0.06] bg-white/[0.028] shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-white/[0.018]">
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dikirim</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Belum ada pembayaran pada status ini.</TableCell></TableRow>
            ) : filtered.map((payment) => (
              <TableRow key={payment.id} className="border-white/[0.05] transition-colors hover:bg-white/[0.025]">
                <TableCell><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300/[0.08] text-amber-300"><ReceiptText className="h-4 w-4" /></span><div><p className="font-mono text-xs font-medium text-slate-200">{payment.invoiceNumber}</p><p className="mt-1 text-xs text-slate-600">{formatDate(payment.createdAt)}</p></div></div></TableCell>
                <TableCell><p className="text-sm font-medium">{payment.user?.name || "User dihapus"}</p><p className="text-xs text-muted-foreground">{payment.user?.email || "-"}</p></TableCell>
                <TableCell className="uppercase">{payment.packageName}</TableCell>
                <TableCell>{formatIDR(payment.amount)}</TableCell>
                <TableCell><Badge variant={statusVariant[payment.status]}>{payment.statusLabel}</Badge></TableCell>
                <TableCell className="text-xs">{payment.proofUploadedAt ? formatDate(payment.proofUploadedAt) : "-"}</TableCell>
                <TableCell className="text-right"><Button size="sm" variant={payment.status === "waiting_verification" ? "default" : "ghost"} className="rounded-xl" onClick={() => open(payment)}><Eye className="h-4 w-4" />Periksa</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(viewing)} onOpenChange={(isOpen) => !isOpen && setViewingId(null)}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-[24px] border-white/[0.08] bg-[#0b0f1b] p-7">
          <DialogHeader>
            <DialogTitle>Verifikasi {viewing?.invoiceNumber}</DialogTitle>
            <DialogDescription>Cocokkan rekening pengirim, nominal, dan bukti sebelum menyetujui.</DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="rounded-[20px] border border-white/[0.07] bg-black/10 p-5 text-sm">
                  <Info label="User" value={`${viewing.user?.name || "-"} (${viewing.user?.email || "-"})`} />
                  <Info label="WhatsApp" value={viewing.user?.whatsapp || "-"} />
                  <Info label="Paket" value={`${viewing.packageName.toUpperCase()} · ${viewing.durationDays} hari`} />
                  <Info label="Nominal" value={formatIDR(viewing.amount)} />
                  <Info label="Nama rekening pengirim" value={viewing.transferAccountName || "-"} />
                  <Info label="Catatan user" value={viewing.userNote || "-"} />
                  <Info label="Rekening tujuan" value={`${viewing.bankName} ${viewing.bankAccountNumber} a.n. ${viewing.bankAccountHolder}`} />
                </div>
                <div className="space-y-2">
                  <Label>Durasi langganan</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {([1, 3, 6, 12] as const).map((months) => (
                      <Button
                        key={months}
                        type="button"
                        variant={durationMonths === months ? "default" : "outline"}
                        onClick={() => setDurationMonths(months)}
                        disabled={viewing.status !== "waiting_verification"}
                        className="rounded-xl"
                      >
                        {months} Bulan
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Masa aktif yang diberikan: {durationMonths * 30} hari.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminNote">Catatan admin</Label>
                  <Textarea id="adminNote" value={adminNote} onChange={(event) => setAdminNote(event.target.value)} maxLength={500} placeholder="Alasan penolakan atau catatan verifikasi" disabled={viewing.status !== "waiting_verification"} className="min-h-28 rounded-2xl bg-black/15" />
                </div>
              </div>
              <div className="min-h-80 overflow-hidden rounded-[20px] border border-white/[0.07] bg-black/25">
                {viewing.hasProof ? (
                  viewing.proofMimeType === "application/pdf" ? (
                    <iframe title={`Bukti ${viewing.invoiceNumber}`} src={`/api/payments/manual/${viewing.id}/proof`} className="h-[60vh] w-full" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/payments/manual/${viewing.id}/proof`} alt={`Bukti transfer ${viewing.invoiceNumber}`} className="h-full max-h-[60vh] w-full object-contain" />
                  )
                ) : <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">Bukti belum diunggah.</div>}
              </div>
            </div>
          )}
          <DialogFooter>
            {viewing?.status === "waiting_verification" ? (
              <>
                <Button variant="destructive" disabled={Boolean(processing)} onClick={() => review("reject")}>
                  {processing === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}Tolak
                </Button>
                <Button disabled={Boolean(processing)} onClick={() => review("approve")}>
                  {processing === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Setujui & Aktifkan
                </Button>
              </>
            ) : <Badge variant={viewing ? statusVariant[viewing.status] : "secondary"}>{viewing?.statusLabel}</Badge>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-white/10 py-2 last:border-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words font-medium">{value}</p></div>;
}
