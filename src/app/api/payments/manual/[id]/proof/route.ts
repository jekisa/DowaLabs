import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/server-auth";
import { fail, ok } from "@/lib/api";
import {
  detectProofMime,
  MAX_PAYMENT_PROOF_BYTES,
  safeProofFilename,
  serializeManualPayment,
} from "@/lib/manual-payment";
import { ManualPayment } from "@/models/ManualPayment";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { user, error } = await requireAuth();
  if (error || !user) return fail("Belum login", 401);

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invoice tidak valid", 400);

  try {
    await connectToDatabase();
    const invoice = await ManualPayment.findOne({ _id: id, userId: user._id });
    if (!invoice) return fail("Invoice tidak ditemukan", 404);
    if (!["pending_payment", "waiting_verification", "rejected"].includes(invoice.status)) {
      return fail("Invoice ini tidak dapat menerima bukti transfer", 409);
    }
    if (invoice.expiresAt.getTime() < Date.now()) {
      invoice.status = "expired";
      await invoice.save();
      return fail("Invoice sudah kedaluwarsa. Buat invoice baru.", 410);
    }

    const form = await req.formData();
    const proof = form.get("proof");
    const transferAccountName = String(form.get("transferAccountName") || "").trim();
    const userNote = String(form.get("userNote") || "").trim();

    if (!(proof instanceof File) || proof.size === 0) {
      return fail("File bukti transfer wajib diunggah", 422);
    }
    if (proof.size > MAX_PAYMENT_PROOF_BYTES) {
      return fail("Ukuran bukti transfer maksimal 4 MB", 413);
    }
    if (transferAccountName.length < 2 || transferAccountName.length > 100) {
      return fail("Nama pemilik rekening pengirim wajib diisi", 422);
    }
    if (userNote.length > 500) return fail("Catatan maksimal 500 karakter", 422);

    const buffer = Buffer.from(await proof.arrayBuffer());
    const mime = detectProofMime(buffer);
    if (!mime) {
      return fail("Format bukti harus PNG, JPG, WEBP, atau PDF", 415);
    }

    invoice.proofData = buffer;
    invoice.proofFilename = safeProofFilename(proof.name, mime);
    invoice.proofMimeType = mime;
    invoice.proofSize = buffer.length;
    invoice.proofUploadedAt = new Date();
    invoice.transferAccountName = transferAccountName;
    invoice.userNote = userNote || null;
    invoice.status = "waiting_verification";
    invoice.adminNote = null;
    invoice.reviewedAt = null;
    invoice.reviewedBy = null;
    await invoice.save();

    return ok({
      invoice: serializeManualPayment(invoice),
      message: "Bukti transfer berhasil dikirim dan menunggu verifikasi admin",
    });
  } catch (error) {
    console.error("[manual payment proof POST] error:", error);
    return fail("Gagal mengunggah bukti transfer", 500);
  }
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const { user, error } = await requireAuth();
  if (error || !user) return fail("Belum login", 401);

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invoice tidak valid", 400);

  try {
    await connectToDatabase();
    const ownerFilter = user.role === "admin" ? {} : { userId: user._id };
    const invoice = await ManualPayment.findOne({ _id: id, ...ownerFilter }).select(
      "+proofData"
    );
    if (!invoice?.proofData || !invoice.proofMimeType) {
      return fail("Bukti transfer tidak ditemukan", 404);
    }

    return new NextResponse(new Uint8Array(invoice.proofData), {
      headers: {
        "Content-Type": invoice.proofMimeType,
        "Content-Disposition": `inline; filename="${invoice.proofFilename || "bukti-transfer"}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[manual payment proof GET] error:", error);
    return fail("Gagal memuat bukti transfer", 500);
  }
}
