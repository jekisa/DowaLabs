import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { ManualPayment } from "@/models/ManualPayment";
import { requireAdmin } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  try {
    await connectToDatabase();
    const [total, active, pending, expired, blocked, payments, unprocessed] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ membershipStatus: "active" }),
        User.countDocuments({ membershipStatus: "pending" }),
        User.countDocuments({ membershipStatus: "expired" }),
        User.countDocuments({ membershipStatus: "blocked" }),
        ManualPayment.countDocuments({}),
        ManualPayment.countDocuments({ status: "waiting_verification" }),
      ]);

    return ok({
      stats: {
        totalUsers: total,
        activeUsers: active,
        pendingUsers: pending,
        expiredUsers: expired,
        blockedUsers: blocked,
        totalPayments: payments,
        unprocessedPayments: unprocessed,
      },
    });
  } catch (e) {
    console.error("[admin/stats GET] error:", e);
    return fail("Gagal memuat statistik", 500);
  }
}
