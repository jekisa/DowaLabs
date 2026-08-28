import mongoose, { Schema, model, models, type Model } from "mongoose";
import type { PackageName } from "@/lib/membership";

export type ManualPaymentStatus =
  | "pending_payment"
  | "waiting_verification"
  | "processing"
  | "approved"
  | "rejected"
  | "expired";

export interface IManualPayment {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  userId: mongoose.Types.ObjectId;
  packageName: PackageName;
  amount: number;
  currency: "IDR";
  durationDays: number;
  status: ManualPaymentStatus;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  expiresAt: Date;
  transferAccountName: string | null;
  userNote: string | null;
  proofData: Buffer | null;
  proofFilename: string | null;
  proofMimeType: string | null;
  proofSize: number | null;
  proofUploadedAt: Date | null;
  adminNote: string | null;
  reviewedBy: mongoose.Types.ObjectId | null;
  reviewedAt: Date | null;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ManualPaymentSchema = new Schema<IManualPayment>(
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
    bankName: { type: String, required: true, trim: true },
    bankAccountNumber: { type: String, required: true, trim: true },
    bankAccountHolder: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true, index: true },
    transferAccountName: { type: String, default: null, trim: true },
    userNote: { type: String, default: null, trim: true },
    proofData: { type: Buffer, default: null, select: false },
    proofFilename: { type: String, default: null },
    proofMimeType: { type: String, default: null },
    proofSize: { type: Number, default: null },
    proofUploadedAt: { type: Date, default: null },
    adminNote: { type: String, default: null, trim: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    subscriptionStart: { type: Date, default: null },
    subscriptionEnd: { type: Date, default: null },
  },
  { timestamps: true }
);

ManualPaymentSchema.index({ userId: 1, createdAt: -1 });
ManualPaymentSchema.index({ status: 1, createdAt: -1 });

export const ManualPayment: Model<IManualPayment> =
  (models.ManualPayment as Model<IManualPayment>) ||
  model<IManualPayment>("ManualPayment", ManualPaymentSchema);
