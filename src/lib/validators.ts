import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { PRO_PRICE } from "@/lib/membership";

const phoneInput = z
  .string()
  .trim()
  .transform(normalizeWhatsapp)
  .refine((v) => /^[0-9]{8,15}$/.test(v), {
    message: "Nomor WhatsApp tidak valid (gunakan format 08xxxx atau +62xxxx)",
  });

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
    email: z.string().trim().toLowerCase().email("Email tidak valid"),
    whatsapp: phoneInput,
    password: z.string().min(8, "Password minimal 8 karakter").max(72),
    confirmPassword: z.string().optional(),
    packageName: z.literal("pro").default("pro"),
  })
  .refine(
    (data) =>
      !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: "Konfirmasi password tidak cocok",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(32, "Token reset tidak valid").max(256),
    password: z.string().min(8, "Password minimal 8 karakter").max(72),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  membershipStatus: z
    .enum(["pending", "active", "expired", "blocked"])
    .optional(),
  packageName: z.literal("pro").optional(),
  membershipStart: z.string().datetime().nullable().optional(),
  membershipEnd: z.string().datetime().nullable().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

const urlField = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.string().url().safeParse(value).success,
    "URL tidak valid"
  );

export const updateSettingsSchema = z.object({
  canvasUrl: urlField.optional(),
  backgroundRemoverUrl: urlField.optional(),
  colorGradingUrl: urlField.optional(),
  portraitStyleUrl: urlField.optional(),
  promptAiUrl: urlField.optional(),
  adminWhatsapp: phoneInput.optional(),
  proPrice: z.coerce.number().refine((value) => value === PRO_PRICE, "Harga Pro harus Rp30.000").optional(),
  bankName: z.string().trim().min(2, "Nama bank wajib diisi").max(80).optional(),
  bankAccountNumber: z
    .string()
    .trim()
    .regex(/^[0-9 -]{5,30}$/, "Nomor rekening tidak valid")
    .optional(),
  bankAccountHolder: z
    .string()
    .trim()
    .min(2, "Nama pemilik rekening wajib diisi")
    .max(100)
    .optional(),
});

export const createManualInvoiceSchema = z.object({
  packageName: z.literal("pro").default("pro"),
});

export const reviewManualPaymentSchema = z.object({
  action: z.enum(["approve", "reject"]),
  adminNote: z.string().trim().max(500).optional().default(""),
  durationMonths: z.coerce.number().int().min(1).max(12).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminUserUpdateInput = z.infer<typeof updateUserSchema>;
export type AdminSettingsInput = z.infer<typeof updateSettingsSchema>;

export const adminUserUpdateSchema = updateUserSchema;
export const adminSettingsSchema = updateSettingsSchema;
