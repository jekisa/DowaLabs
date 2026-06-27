import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword, createSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { ok, fail, zodErrors } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Data tidak valid", 422, zodErrors(parsed.error));
  }

  const { name, email, whatsapp, password, packageName } = parsed.data;

  try {
    await connectToDatabase();

    const existing = await User.findOne({ email });
    if (existing) {
      return fail("Email sudah terdaftar. Silakan login.", 409);
    }

    const user = await User.create({
      name,
      email,
      whatsapp,
      passwordHash: await hashPassword(password),
      role: "user",
      membershipStatus: "pending",
      packageName,
    });

    await createSessionCookie({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return ok({ redirect: "/payment", userId: user._id.toString() });
  } catch (error) {
    console.error("[signup] error:", error);
    return fail("Terjadi kesalahan pada server", 500);
  }
}
