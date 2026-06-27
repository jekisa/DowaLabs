import mongoose, { Schema, model, models, type Model } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

export interface IAppSettings {
  _id: mongoose.Types.ObjectId;
  key: string;
  canvasUrl: string;
  lynkBasicUrl: string;
  lynkProUrl: string;
  adminWhatsapp: string;
  basicPrice: number;
  proPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const AppSettingsSchema = new Schema<IAppSettings>(
  {
    // Singleton document keyed by a constant so we always upsert the same row.
    key: { type: String, default: "global", unique: true },
    canvasUrl: { type: String, default: "" },
    lynkBasicUrl: { type: String, default: "" },
    lynkProUrl: { type: String, default: "" },
    adminWhatsapp: { type: String, default: "" },
    basicPrice: { type: Number, default: 19000 },
    proPrice: { type: Number, default: 35000 },
  },
  { timestamps: true }
);

export const AppSettings: Model<IAppSettings> =
  (models.AppSettings as Model<IAppSettings>) ||
  model<IAppSettings>("AppSettings", AppSettingsSchema);

/**
 * Fetch the singleton settings doc, creating it with sensible defaults
 * (pulled from env) on first access.
 */
export async function getAppSettings(): Promise<IAppSettings> {
  await connectToDatabase();
  const existing = await AppSettings.findOne({ key: "global" });
  if (existing) return existing;

  return AppSettings.create({
    key: "global",
    canvasUrl: process.env.DEFAULT_CANVAS_URL || "",
    lynkBasicUrl: process.env.DEFAULT_LYNK_BASIC_URL || "",
    lynkProUrl: process.env.DEFAULT_LYNK_PRO_URL || "",
    adminWhatsapp: process.env.DEFAULT_ADMIN_WHATSAPP || "",
    basicPrice: Number(process.env.DEFAULT_BASIC_PRICE) || 19000,
    proPrice: Number(process.env.DEFAULT_PRO_PRICE) || 35000,
  });
}
