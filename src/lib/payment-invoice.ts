import { randomBytes } from "node:crypto";
import type { IPaymentInvoice, PaymentInvoiceStatus } from "@/models/PaymentInvoice";

export const INVOICE_EXPIRY_HOURS = 24;

export const PAYMENT_INVOICE_STATUS_LABELS: Record<PaymentInvoiceStatus, string> = {
  pending_payment: "Menunggu Pembayaran",
  waiting_verification: "Menunggu Konfirmasi",
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

export function serializePaymentInvoice(payment: IPaymentInvoice) {
  return {
    id: payment._id.toString(),
    invoiceNumber: payment.invoiceNumber,
    userId: payment.userId.toString(),
    packageName: payment.packageName,
    amount: payment.amount,
    currency: payment.currency,
    durationDays: payment.durationDays,
    status: payment.status,
    statusLabel: PAYMENT_INVOICE_STATUS_LABELS[payment.status],
    expiresAt: payment.expiresAt.toISOString(),
    adminNote: payment.adminNote,
    reviewedAt: payment.reviewedAt?.toISOString() ?? null,
    subscriptionStart: payment.subscriptionStart?.toISOString() ?? null,
    subscriptionEnd: payment.subscriptionEnd?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  };
}

export type SerializedPaymentInvoice = ReturnType<typeof serializePaymentInvoice>;
