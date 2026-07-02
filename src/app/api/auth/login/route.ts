import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { createSessionCookie } from "@/lib/auth";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/lib/validators";
import { ok, fail, zodErrors } from "@/lib/api";
import { isExpired, type MembershipStatus } from "@/lib/membership";
import { serializeUser } from "@/lib/serialize";

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
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return fail("Email atau password salah", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
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

    await createSessionCookie(user);

    return ok({
      redirect: user.role === "admin" ? "/admin" : "/dashboard",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("[login] error:", error);
    return fail("Terjadi kesalahan pada server", 500);
  }
}
