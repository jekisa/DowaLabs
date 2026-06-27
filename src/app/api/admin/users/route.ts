import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";
import { serializeUser } from "@/lib/serialize";
import type { FilterQuery } from "mongoose";
import type { IUser } from "@/models/User";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();
    const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);

    const query: FilterQuery<IUser> = {};
    if (status && ["pending", "active", "expired", "blocked"].includes(status)) {
      query.membershipStatus = status;
    }
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      query.$or = [{ name: rx }, { email: rx }, { whatsapp: rx }];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return ok({ users: users.map(serializeUser) });
  } catch (e) {
    console.error("[admin/users GET] error:", e);
    return fail("Gagal memuat data user", 500);
  }
}
