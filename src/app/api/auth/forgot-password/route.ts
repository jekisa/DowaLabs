import { createHash, randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { fail, ok, zodErrors } from "@/lib/api";
import {
  isEmailDeliveryConfigured,
  sendPasswordResetEmail,
} from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { forgotPasswordSchema } from "@/lib/validators";
import { User } from "@/models/User";

export const runtime = "nodejs";

const RESET_TOKEN_LIFETIME_MS = 30 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 60 * 1000;
const GENERIC_MESSAGE =
  "Jika email terdaftar, tautan reset password akan segera dikirim.";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Email tidak valid", 422, zodErrors(parsed.error));
  }

  if (!isEmailDeliveryConfigured()) {
    return fail("Layanan email reset password belum dikonfigurasi", 503);
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: parsed.data.email }).select(
      "+passwordResetTokenHash +passwordResetExpiresAt +passwordResetRequestedAt"
    );

    if (!user) return ok({ message: GENERIC_MESSAGE });

    const now = Date.now();
    if (
      user.passwordResetRequestedAt &&
      now - user.passwordResetRequestedAt.getTime() < REQUEST_COOLDOWN_MS
    ) {
      return ok({ message: GENERIC_MESSAGE });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = new Date(now + RESET_TOKEN_LIFETIME_MS);
    user.passwordResetRequestedAt = new Date(now);
    await user.save();

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(
      /\/$/,
      ""
    );
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (error) {
      await User.updateOne(
        { _id: user._id, passwordResetTokenHash: tokenHash },
        {
          $unset: {
            passwordResetTokenHash: 1,
            passwordResetExpiresAt: 1,
          },
        }
      );
      console.error("[forgot-password] email error:", error);
      return fail("Email reset belum dapat dikirim. Silakan coba lagi.", 502);
    }

    return ok({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("[forgot-password] error:", error);
    return fail("Terjadi kesalahan pada server", 500);
  }
}
