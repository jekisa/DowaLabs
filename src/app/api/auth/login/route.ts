import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPassword, createSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { ok, fail, zodErrors } from "@/lib/api";
import { ensureDefaultAdmin } from "@/lib/bootstrap";
import { isExpired, type MembershipStatus } from "@/lib/membership";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Data tidak valid", 422, zodErrors(parsed.error));
  }

  const { email, password } = parsed.data;

  try {
    await connectToDatabase();
    // Make sure the default admin exists (first-run convenience).
    await ensureDefaultAdmin();

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return fail("Email atau password salah", 401);
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return fail("Email atau password salah", 401);
    }

    // Lazily expire memberships whose end date has passed.
    if (
      isExpired(user.membershipStatus as MembershipStatus, user.membershipEnd)
    ) {
      user.membershipStatus = "expired";
    }

    user.lastLoginAt = new Date();
    await user.save();

    await createSessionCookie({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return ok({ redirect: user.role === "admin" ? "/admin" : "/dashboard" });
  } catch (error) {
    console.error("[login] error:", error);
    return fail("Terjadi kesalahan pada server", 500);
  }
}
