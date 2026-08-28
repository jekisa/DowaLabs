import { randomBytes } from "node:crypto";
import type { IManualPayment, ManualPaymentStatus } from "@/models/ManualPayment";

export const MAX_PAYMENT_PROOF_BYTES = 4 * 1024 * 1024;
export const INVOICE_EXPIRY_HOURS = 24;

export const MANUAL_PAYMENT_STATUS_LABELS: Record<ManualPaymentStatus, string> = {
  pending_payment: "Menunggu Transfer",
  waiting_verification: "Menunggu Verifikasi",
  processing: "Sedang Diproses",
  approved: "Disetujui",
  rejected: "Ditolak",
  expired: "Kedaluwarsa",
};

export function createInvoiceNumber(now = new Date()): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function invoiceExpiry(now = new Date()): Date {
  return new Date(now.getTime() + INVOICE_EXPIRY_HOURS * 60 * 60 * 1000);
}

export function detectProofMime(buffer: Buffer): string | null {
  if (buffer.length >= 4 && buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }
  return null;
}

export function safeProofFilename(filename: string, mime: string): string {
  const extension: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
  };
  const base = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "bukti-transfer";
  return base + extension[mime];
}

export function serializeManualPayment(payment: IManualPayment) {
  return {
    id: payment._id.toString(),
    invoiceNumber: payment.invoiceNumber,
    userId: payment.userId.toString(),
    packageName: payment.packageName,
    amount: payment.amount,
    currency: payment.currency,
    durationDays: payment.durationDays,
    status: payment.status,
    statusLabel: MANUAL_PAYMENT_STATUS_LABELS[payment.status],
    bankName: payment.bankName,
    bankAccountNumber: payment.bankAccountNumber,
    bankAccountHolder: payment.bankAccountHolder,
    expiresAt: payment.expiresAt.toISOString(),
    transferAccountName: payment.transferAccountName,
    userNote: payment.userNote,
    hasProof: Boolean(payment.proofUploadedAt && payment.proofSize),
    proofFilename: payment.proofFilename,
    proofMimeType: payment.proofMimeType,
    proofSize: payment.proofSize,
    proofUploadedAt: payment.proofUploadedAt?.toISOString() ?? null,
    adminNote: payment.adminNote,
    reviewedAt: payment.reviewedAt?.toISOString() ?? null,
    subscriptionStart: payment.subscriptionStart?.toISOString() ?? null,
    subscriptionEnd: payment.subscriptionEnd?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  };
}

export type SerializedManualPayment = ReturnType<typeof serializeManualPayment>;
