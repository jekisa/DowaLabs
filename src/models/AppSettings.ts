import mongoose, { Schema, model, models, type Model } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { PRO_PRICE } from "@/lib/membership";

export interface IAppSettings {
  _id: mongoose.Types.ObjectId;
  key: string;
  canvasUrl: string;
  backgroundRemoverUrl: string;
  colorGradingUrl: string;
  portraitStyleUrl: string;
  promptAiUrl: string;
  adminWhatsapp: string;
  basicPrice: number;
  proPrice: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppSettingsSchema = new Schema<IAppSettings>(
  {
    // Singleton document keyed by a constant so we always upsert the same row.
    key: { type: String, default: "global", unique: true },
    canvasUrl: { type: String, default: "" },
    backgroundRemoverUrl: { type: String, default: "" },
    colorGradingUrl: { type: String, default: "" },
    portraitStyleUrl: { type: String, default: "" },
    promptAiUrl: { type: String, default: "" },
    adminWhatsapp: { type: String, default: "" },
    basicPrice: { type: Number, default: 19000 },
    proPrice: { type: Number, default: PRO_PRICE },
    bankName: { type: String, default: "" },
    bankAccountNumber: { type: String, default: "" },
    bankAccountHolder: { type: String, default: "" },
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
  if (existing) {
    // DowaLabs now has one public plan with a fixed Rp30.000 price.
    // Keep the legacy Basic fields in storage so old records remain readable.
    if (existing.proPrice !== PRO_PRICE) {
      existing.proPrice = PRO_PRICE;
      await existing.save();
    }
    return existing;
  }

  return AppSettings.create({
    key: "global",
    canvasUrl: process.env.DEFAULT_CANVAS_URL || "",
    backgroundRemoverUrl: process.env.DEFAULT_BACKGROUND_REMOVER_URL || "",
    colorGradingUrl: process.env.DEFAULT_COLOR_GRADING_URL || "",
    portraitStyleUrl: process.env.DEFAULT_PORTRAIT_STYLE_URL || "",
    promptAiUrl: process.env.DEFAULT_PROMPT_AI_URL || "",
    adminWhatsapp:
      process.env.ADMIN_WHATSAPP ||
      process.env.DEFAULT_ADMIN_WHATSAPP ||
      "",
    basicPrice: Number(process.env.DEFAULT_BASIC_PRICE) || 19000,
    proPrice: PRO_PRICE,
    bankName: process.env.BANK_NAME || "",
    bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
    bankAccountHolder: process.env.BANK_ACCOUNT_HOLDER || "",
  });
}
