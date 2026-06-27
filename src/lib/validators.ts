import { z } from "zod";

const whatsappRegex = /^\+?[0-9]{8,15}$/;
const phoneInput = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine((v) => whatsappRegex.test(v), {
    message: "Nomor WhatsApp tidak valid (gunakan format 08xxxx atau +62xxxx)",
  });

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
    email: z.string().trim().toLowerCase().email("Email tidak valid"),
    whatsapp: phoneInput,
    password: z.string().min(8, "Password minimal 8 karakter").max(72),
    confirmPassword: z.string().optional(),
    packageName: z.enum(["basic", "pro"]).default("basic"),
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

export const adminUserUpdateSchema = z.object({
  membershipStatus: z
    .enum(["pending", "active", "expired", "blocked"])
    .optional(),
  packageName: z.enum(["basic", "pro"]).nullable().optional(),
  membershipStart: z.string().datetime().nullable().optional(),
  membershipEnd: z.string().datetime().nullable().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

const urlField = z.string().trim().url("URL tidak valid");

export const adminSettingsSchema = z.object({
  canvasUrl: urlField.optional(),
  lynkBasicUrl: urlField.optional(),
  lynkProUrl: urlField.optional(),
  adminWhatsapp: phoneInput.optional(),
  basicPrice: z.coerce.number().min(0, "Harga harus >= 0").optional(),
  proPrice: z.coerce.number().min(0, "Harga harus >= 0").optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type AdminSettingsInput = z.infer<typeof adminSettingsSchema>;
