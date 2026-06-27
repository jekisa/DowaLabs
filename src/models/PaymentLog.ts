import mongoose, { Schema, model, models, type Model } from "mongoose";
import type { PackageName } from "@/lib/membership";

export interface IPaymentLog {
  _id: mongoose.Types.ObjectId;
  provider: "lynk";
  userId: mongoose.Types.ObjectId | null;
  orderId: string | null;
  transactionId: string | null;
  email: string | null;
  whatsapp: string | null;
  amount: number | null;
  currency: string;
  packageName: PackageName | null;
  status: string;
  rawPayload: Record<string, unknown>;
  processed: boolean;
  processingError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentLogSchema = new Schema<IPaymentLog>(
  {
    provider: { type: String, default: "lynk" },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    orderId: { type: String, default: null },
    transactionId: { type: String, default: null },
    email: { type: String, default: null },
    whatsapp: { type: String, default: null },
    amount: { type: Number, default: null },
    currency: { type: String, default: "IDR" },
    packageName: { type: String, enum: ["basic", "pro", null], default: null },
    status: { type: String, default: "unknown", index: true },
    rawPayload: { type: Schema.Types.Mixed, default: {} },
    processed: { type: Boolean, default: false, index: true },
    processingError: { type: String, default: null },
  },
  { timestamps: true }
);

// Unique sparse indexes prevent processing the same order/transaction twice
// while still allowing many logs without an id.
PaymentLogSchema.index({ orderId: 1 }, { unique: true, sparse: true });
PaymentLogSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

export const PaymentLog: Model<IPaymentLog> =
  (models.PaymentLog as Model<IPaymentLog>) ||
  model<IPaymentLog>("PaymentLog", PaymentLogSchema);
