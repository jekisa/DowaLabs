import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/server-auth";
import { fail, ok, zodErrors } from "@/lib/api";
import { reviewManualPaymentSchema } from "@/lib/validators";
import { computeMembershipEnd } from "@/lib/membership";
import { serializeManualPayment } from "@/lib/manual-payment";
import { ManualPayment } from "@/models/ManualPayment";
import { User } from "@/models/User";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { user: admin, error } = await requireAdmin();
  if (error === "UNAUTHENTICATED" || !admin) return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invoice tidak valid", 400);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }
  const parsed = reviewManualPaymentSchema.safeParse(body);
  if (!parsed.success) return fail("Data tidak valid", 422, zodErrors(parsed.error));

  try {
    await connectToDatabase();

    if (parsed.data.action === "reject") {
      const rejected = await ManualPayment.findOneAndUpdate(
        { _id: id, status: "waiting_verification" },
        {
          $set: {
            status: "rejected",
            adminNote: parsed.data.adminNote || "Bukti transfer ditolak",
            reviewedBy: admin._id,
            reviewedAt: new Date(),
          },
        },
        { new: true }
      );
      if (!rejected) return fail("Pembayaran sudah diproses atau belum siap diverifikasi", 409);
      return ok({ invoice: serializeManualPayment(rejected), message: "Pembayaran ditolak" });
    }

    if (!parsed.data.durationMonths) {
      return fail("Durasi langganan wajib dipilih", 422);
    }

    const session = await mongoose.startSession();
    let approvedId: mongoose.Types.ObjectId | null = null;
    try {
      await session.withTransaction(async () => {
        const invoice = await ManualPayment.findOne({
          _id: id,
          status: "waiting_verification",
          proofUploadedAt: { $ne: null },
        }).session(session);
        if (!invoice) throw new Error("PAYMENT_NOT_REVIEWABLE");

        const member = await User.findById(invoice.userId).session(session);
        if (!member) throw new Error("USER_NOT_FOUND");
        if (member.membershipStatus === "blocked") throw new Error("USER_BLOCKED");

        const now = new Date();
        const hasActivePeriod =
          member.membershipStatus === "active" &&
          Boolean(member.membershipEnd && member.membershipEnd.getTime() > now.getTime());
        const subscriptionStart = hasActivePeriod
          ? member.membershipStart || now
          : now;
        const durationDays = parsed.data.durationMonths! * 30;
        const subscriptionEnd = computeMembershipEnd(
          hasActivePeriod ? member.membershipEnd : null,
          now,
          durationDays
        );

        member.membershipStatus = "active";
        member.packageName = invoice.packageName;
        member.membershipStart = subscriptionStart;
        member.membershipEnd = subscriptionEnd;
        await member.save({ session });

        invoice.status = "approved";
        invoice.durationDays = durationDays;
        invoice.adminNote = parsed.data.adminNote || "Transfer terverifikasi";
        invoice.reviewedBy = admin._id;
        invoice.reviewedAt = now;
        invoice.subscriptionStart = subscriptionStart;
        invoice.subscriptionEnd = subscriptionEnd;
        await invoice.save({ session });
        approvedId = invoice._id;
      });
    } finally {
      await session.endSession();
    }

    if (!approvedId) return fail("Pembayaran gagal disetujui", 500);
    const approved = await ManualPayment.findById(approvedId);
    return ok({
      invoice: serializeManualPayment(approved!),
      message: "Pembayaran disetujui dan subscription telah diaktifkan",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "PAYMENT_NOT_REVIEWABLE") {
      return fail("Pembayaran sudah diproses atau belum siap diverifikasi", 409);
    }
    if (message === "USER_NOT_FOUND") return fail("User tidak ditemukan", 404);
    if (message === "USER_BLOCKED") {
      return fail("User diblokir. Buka blokir sebelum menyetujui pembayaran.", 409);
    }
    console.error("[admin manual payment PATCH] error:", error);
    return fail("Gagal memverifikasi pembayaran", 500);
  }
}
