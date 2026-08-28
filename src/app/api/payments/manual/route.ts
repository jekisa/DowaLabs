import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/server-auth";
import { ok, fail, zodErrors } from "@/lib/api";
import { createManualInvoiceSchema } from "@/lib/validators";
import {
  createInvoiceNumber,
  invoiceExpiry,
  serializeManualPayment,
} from "@/lib/manual-payment";
import { MEMBERSHIP_DAYS, PRO_PRICE } from "@/lib/membership";
import { ManualPayment } from "@/models/ManualPayment";
import { getAppSettings } from "@/models/AppSettings";

export const runtime = "nodejs";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error || !user) return fail("Belum login", 401);

  try {
    await connectToDatabase();
    await ManualPayment.updateMany(
      {
        userId: user._id,
        status: "pending_payment",
        expiresAt: { $lt: new Date() },
      },
      { $set: { status: "expired" } }
    );
    const invoices = await ManualPayment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    return ok({ invoices: invoices.map(serializeManualPayment) });
  } catch (error) {
    console.error("[manual payment GET] error:", error);
    return fail("Gagal memuat invoice", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error || !user) return fail("Belum login", 401);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = createManualInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Data tidak valid", 422, zodErrors(parsed.error));
  }

  try {
    await connectToDatabase();
    const settings = await getAppSettings();
    const bankName = settings.bankName || process.env.BANK_NAME || "";
    const bankAccountNumber =
      settings.bankAccountNumber || process.env.BANK_ACCOUNT_NUMBER || "";
    const bankAccountHolder =
      settings.bankAccountHolder || process.env.BANK_ACCOUNT_HOLDER || "";

    if (!bankName || !bankAccountNumber || !bankAccountHolder) {
      return fail(
        "Rekening perusahaan belum dikonfigurasi. Hubungi admin.",
        503
      );
    }

    const now = new Date();
    await ManualPayment.updateMany(
      {
        userId: user._id,
        status: "pending_payment",
        expiresAt: { $lt: now },
      },
      { $set: { status: "expired" } }
    );

    const openInvoice = await ManualPayment.findOne({
      userId: user._id,
      $or: [
        { status: "pending_payment", expiresAt: { $gte: now } },
        { status: { $in: ["waiting_verification", "processing"] } },
      ],
    }).sort({ createdAt: -1 });

    if (
      openInvoice &&
      (openInvoice.packageName === parsed.data.packageName ||
        openInvoice.status !== "pending_payment")
    ) {
      return ok({
        invoice: serializeManualPayment(openInvoice),
        reused: true,
        message:
          openInvoice.status === "pending_payment"
            ? "Invoice aktif digunakan kembali"
            : "Bukti transfer Anda masih menunggu verifikasi",
      });
    }

    if (openInvoice?.status === "pending_payment") {
      openInvoice.status = "expired";
      await openInvoice.save();
    }

    const amount = PRO_PRICE;
    if (!Number.isFinite(amount) || amount <= 0) {
      return fail("Harga paket belum dikonfigurasi dengan benar", 503);
    }
    const invoice = await ManualPayment.create({
      invoiceNumber: createInvoiceNumber(now),
      userId: user._id,
      packageName: "pro",
      amount,
      currency: "IDR",
      durationDays: MEMBERSHIP_DAYS,
      status: "pending_payment",
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      expiresAt: invoiceExpiry(now),
    });

    return ok({
      invoice: serializeManualPayment(invoice),
      reused: false,
      message: "Invoice berhasil dibuat",
    });
  } catch (error) {
    console.error("[manual payment POST] error:", error);
    return fail("Gagal membuat invoice", 500);
  }
}
