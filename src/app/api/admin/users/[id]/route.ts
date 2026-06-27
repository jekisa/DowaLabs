import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/server-auth";
import { ok, fail, zodErrors } from "@/lib/api";
import { adminUserUpdateSchema } from "@/lib/validators";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return fail("ID user tidak valid", 400);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Data tidak valid", 422, zodErrors(parsed.error));
  }

  try {
    await connectToDatabase();
    const user = await User.findById(id);
    if (!user) return fail("User tidak ditemukan", 404);

    const data = parsed.data;
    if (data.membershipStatus !== undefined)
      user.membershipStatus = data.membershipStatus;
    if (data.packageName !== undefined) user.packageName = data.packageName;
    if (data.role !== undefined) user.role = data.role;
    if (data.membershipStart !== undefined)
      user.membershipStart = data.membershipStart
        ? new Date(data.membershipStart)
        : null;
    if (data.membershipEnd !== undefined)
      user.membershipEnd = data.membershipEnd
        ? new Date(data.membershipEnd)
        : null;

    await user.save();
    return ok({ user: serializeUser(user) });
  } catch (e) {
    console.error("[admin/users PATCH] error:", e);
    return fail("Gagal memperbarui user", 500);
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return fail("ID user tidak valid", 400);
  }

  await connectToDatabase();
  const user = await User.findById(id);
  if (!user) return fail("User tidak ditemukan", 404);
  return ok({ user: serializeUser(user) });
}
