import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PaymentLog } from "@/models/PaymentLog";
import { requireAdmin } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";
import { serializePaymentLog } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  try {
    await connectToDatabase();
    const limit = Math.min(
      Number(req.nextUrl.searchParams.get("limit")) || 100,
      500
    );
    const logs = await PaymentLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit);
    return ok({ payments: logs.map(serializePaymentLog) });
  } catch (e) {
    console.error("[admin/payments GET] error:", e);
    return fail("Gagal memuat payment log", 500);
  }
}
