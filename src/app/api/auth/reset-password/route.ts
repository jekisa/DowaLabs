import { createHash } from "crypto";
import { NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { fail, ok, zodErrors } from "@/lib/api";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validators";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Data tidak valid", 422, zodErrors(parsed.error));
  }

  try {
    await connectToDatabase();
    const tokenHash = createHash("sha256")
      .update(parsed.data.token)
      .digest("hex");
    const resetFilter = {
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    };
    const candidate = await User.findOne(resetFilter).select("_id");

    if (!candidate) {
      return fail(
        "Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.",
        400
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await User.findOneAndUpdate(
      {
        _id: candidate._id,
        ...resetFilter,
      },
      {
        $set: { passwordHash },
        $unset: {
          passwordResetTokenHash: 1,
          passwordResetExpiresAt: 1,
          passwordResetRequestedAt: 1,
        },
        $inc: { sessionVersion: 1 },
      },
      { new: true }
    );

    if (!user) {
      return fail(
        "Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.",
        400
      );
    }

    await clearSessionCookie();
    return ok({
      message: "Password berhasil diperbarui. Silakan login kembali.",
    });
  } catch (error) {
    console.error("[reset-password] error:", error);
    return fail("Terjadi kesalahan pada server", 500);
  }
}
