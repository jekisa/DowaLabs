import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { createSessionCookie } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validators";
import { ok, fail, zodErrors } from "@/lib/api";
import { serializeUser } from "@/lib/serialize";

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

  const { name, email, whatsapp, password } = parsed.data;

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
      packageName: "pro",
      membershipStart: null,
      membershipEnd: null,
    });

    await createSessionCookie(user);

    return ok({
      message: "Signup berhasil. Silakan buat invoice transfer bank.",
      redirect: "/payment",
      user: serializeUser(user),
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const duplicate = error as {
        keyPattern?: Record<string, number>;
      };
      const field = Object.keys(duplicate.keyPattern ?? {})[0];
      if (field === "email") {
        return fail("Email sudah terdaftar. Silakan login.", 409);
      }
      return fail(
        `Data gagal disimpan karena nilai duplikat${field ? ` pada field ${field}` : ""}.`,
        409
      );
    }
    console.error("[signup] error:", error);
    return fail("Terjadi kesalahan pada server", 500);
  }
}
