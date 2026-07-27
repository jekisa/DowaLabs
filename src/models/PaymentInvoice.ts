import mongoose, { Schema, model, models, type Model } from "mongoose";
import type { PackageName } from "@/lib/membership";

export type PaymentInvoiceStatus =
  | "pending_payment"
  | "waiting_verification"
  | "processing"
  | "approved"
  | "rejected"
  | "expired";

export interface IPaymentInvoice {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  userId: mongoose.Types.ObjectId;
  packageName: PackageName;
  amount: number;
  currency: "IDR";
  durationDays: number;
  status: PaymentInvoiceStatus;
  expiresAt: Date;
  adminNote: string | null;
  reviewedBy: mongoose.Types.ObjectId | null;
  reviewedAt: Date | null;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentInvoiceSchema = new Schema<IPaymentInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    packageName: {
      type: String,
      enum: ["basic", "pro"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["IDR"], default: "IDR" },
    durationDays: { type: Number, required: true, min: 1, default: 30 },
    status: {
      type: String,
      enum: [
        "pending_payment",
        "waiting_verification",
        "processing",
        "approved",
        "rejected",
        "expired",
      ],
      default: "pending_payment",
      index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
    adminNote: { type: String, default: null, trim: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    subscriptionStart: { type: Date, default: null },
    subscriptionEnd: { type: Date, default: null },
  },
  { timestamps: true, collection: "manualpayments" }
);

PaymentInvoiceSchema.index({ userId: 1, createdAt: -1 });
PaymentInvoiceSchema.index({ status: 1, createdAt: -1 });

export const PaymentInvoice: Model<IPaymentInvoice> =
  (models.PaymentInvoice as Model<IPaymentInvoice>) ||
  model<IPaymentInvoice>("PaymentInvoice", PaymentInvoiceSchema);
