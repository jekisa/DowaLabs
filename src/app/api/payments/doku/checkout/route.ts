import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/server-auth";
import { fail, ok, zodErrors } from "@/lib/api";
import { createManualInvoiceSchema } from "@/lib/validators";
import {
  createInvoiceNumber,
  invoiceExpiry,
  serializePaymentInvoice,
} from "@/lib/payment-invoice";
import { MEMBERSHIP_DAYS, PRO_PRICE } from "@/lib/membership";
import {
  DOKU_CHECKOUT_PATH,
  createDokuDigest,
  createDokuSignature,
  getDokuBaseUrl,
  isDokuConfigured,
} from "@/lib/doku";
import { PaymentInvoice } from "@/models/PaymentInvoice";

export const runtime = "nodejs";

function appUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
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
  if (!parsed.success) return fail("Data tidak valid", 422, zodErrors(parsed.error));

  if (!isDokuConfigured()) {
    return fail("DOKU belum dikonfigurasi. Hubungi admin.", 503);
  }

  const clientId = process.env.DOKU_CLIENT_ID;
  const secretKey = process.env.DOKU_SECRET_KEY;
  if (!clientId || !secretKey) {
    return fail("DOKU belum dikonfigurasi. Hubungi admin.", 503);
  }

  try {
    await connectToDatabase();

    const now = new Date();
    await PaymentInvoice.updateMany(
      {
        userId: user._id,
        status: "pending_payment",
        expiresAt: { $lt: now },
      },
      { $set: { status: "expired" } }
    );

    let invoice = await PaymentInvoice.findOne({
      userId: user._id,
      packageName: parsed.data.packageName,
      status: "pending_payment",
      expiresAt: { $gte: now },
    }).sort({ createdAt: -1 });

    if (!invoice) {
      invoice = await PaymentInvoice.create({
        invoiceNumber: createInvoiceNumber(now),
        userId: user._id,
        packageName: "pro",
        amount: PRO_PRICE,
        currency: "IDR",
        durationDays: MEMBERSHIP_DAYS,
        status: "pending_payment",
        expiresAt: invoiceExpiry(now),
      });
    }

    const requestBody = {
      order: {
        amount: invoice.amount,
        invoice_number: invoice.invoiceNumber,
        currency: "IDR",
        callback_url: appUrl("/payment?status=doku"),
        callback_url_result: appUrl("/payment?status=doku"),
        auto_redirect: true,
        line_items: [
          {
            id: "pro-membership",
            name: "DowaLabs Pro Membership",
            price: invoice.amount,
            quantity: 1,
          },
        ],
      },
      payment: {
        payment_due_date: Math.max(
          1,
          Math.ceil((invoice.expiresAt.getTime() - now.getTime()) / 60000)
        ),
      },
      customer: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.whatsapp,
      },
      additional_info: {
        override_notification_url: appUrl("/api/webhook/doku"),
        package_name: "pro",
        user_id: user._id.toString(),
      },
    };

    const rawBody = JSON.stringify(requestBody);
    const requestId = randomUUID();
    const requestTimestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const response = await fetch(`${getDokuBaseUrl()}${DOKU_CHECKOUT_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": requestTimestamp,
        Signature: createDokuSignature({
          clientId,
          requestId,
          requestTimestamp,
          requestTarget: DOKU_CHECKOUT_PATH,
          digest: createDokuDigest(rawBody),
          secretKey,
        }),
      },
      body: rawBody,
    });

    const dokuPayload = await response.json().catch(() => ({}));
    const paymentUrl =
      dokuPayload?.response?.payment?.url ||
      dokuPayload?.payment?.url ||
      dokuPayload?.checkout?.url ||
      null;

    if (!response.ok || typeof paymentUrl !== "string") {
      console.error("[doku checkout] failed:", dokuPayload);
      const dokuCode =
        typeof dokuPayload?.error?.code === "string"
          ? dokuPayload.error.code
          : typeof dokuPayload?.code === "string"
            ? dokuPayload.code
            : null;
      const dokuMessage =
        Array.isArray(dokuPayload?.error_messages)
          ? dokuPayload.error_messages.join(", ")
          : Array.isArray(dokuPayload?.message)
            ? dokuPayload.message.join(", ")
            : typeof dokuPayload?.message === "string"
              ? dokuPayload.message
              : typeof dokuPayload?.error?.message === "string"
                ? dokuPayload.error.message
              : "Gagal membuat sesi pembayaran DOKU";
      return fail(`DOKU${dokuCode ? ` ${dokuCode}` : ""}: ${dokuMessage}`, 502, dokuPayload);
    }

    return ok({
      invoice: serializePaymentInvoice(invoice),
      paymentUrl,
      message: "Checkout DOKU berhasil dibuat",
    });
  } catch (error) {
    console.error("[doku checkout] error:", error);
    return fail("Gagal membuat checkout DOKU", 500);
  }
}
