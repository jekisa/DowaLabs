import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";
import { serializeManualPayment } from "@/lib/manual-payment";
import { ManualPayment } from "@/models/ManualPayment";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  try {
    await connectToDatabase();
    const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 100, 500);
    const status = req.nextUrl.searchParams.get("status");
    const query = status ? { status } : {};
    const payments = await ManualPayment.find(query).sort({ createdAt: -1 }).limit(limit);
    const userIds = [...new Set(payments.map((payment) => payment.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email whatsapp");
    const userMap = new Map(users.map((user) => [user._id.toString(), {
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
    }]));

    return ok({
      payments: payments.map((payment) => ({
        ...serializeManualPayment(payment),
        user: userMap.get(payment.userId.toString()) ?? null,
      })),
    });
  } catch (error) {
    console.error("[admin payments GET] error:", error);
    return fail("Gagal memuat pembayaran", 500);
  }
}
