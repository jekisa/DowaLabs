import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PaymentLog, type IPaymentLog } from "@/models/PaymentLog";
import { User } from "@/models/User";
import { parseLynkPayload, verifyWebhookSecret } from "@/lib/lynk";
import { computeMembershipEnd, isSuccessStatus } from "@/lib/membership";
import type { HydratedDocument } from "mongoose";

export const runtime = "nodejs";

/**
 * Lynk.id payment webhook.
 *
 * Design goals (PRD §14.4 / §18):
 *  - Never crash on an unexpected payload shape.
 *  - Always persist the raw payload to PaymentLog.
 *  - Idempotent: a repeated order/transaction is not processed twice.
 *  - Return HTTP 200 after safe handling so Lynk stops retrying.
 */
export async function POST(req: NextRequest) {
  // 1. Read + parse the body defensively.
  let rawText = "";
  let payload: Record<string, unknown> = {};
  try {
    rawText = await req.text();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        payload = parsed as Record<string, unknown>;
      } else {
        payload = { _raw: parsed };
      }
    }
  } catch {
    // Not JSON — keep the raw text so an admin can inspect it later.
    payload = { _rawText: rawText };
  }

  // 2. Optional signature/secret verification.
  if (!verifyWebhookSecret(req.headers, payload)) {
    console.warn("[lynk webhook] invalid signature/secret");
    try {
      await connectToDatabase();
      await PaymentLog.create({
        provider: "lynk",
        status: "rejected_signature",
        rawPayload: payload,
        processed: false,
        processingError: "INVALID_SIGNATURE",
      });
    } catch (e) {
      console.error("[lynk webhook] failed to log rejected payload:", e);
    }
    return NextResponse.json(
      { ok: false, error: "invalid signature" },
      { status: 401 }
    );
  }

  const fields = parseLynkPayload(payload);

  try {
    await connectToDatabase();

    // 3. Idempotency: look for an existing log with same order/transaction id.
    let log: HydratedDocument<IPaymentLog> | null = null;
    const idOr: Record<string, unknown>[] = [];
    if (fields.orderId) idOr.push({ orderId: fields.orderId });
    if (fields.transactionId)
      idOr.push({ transactionId: fields.transactionId });

    if (idOr.length > 0) {
      log = await PaymentLog.findOne({ $or: idOr });
      if (log && log.processed) {
        // Already activated for this payment — skip but acknowledge.
        return NextResponse.json({ ok: true, duplicate: true });
      }
    }

    // 4. Upsert/create the payment log with the latest payload.
    if (!log) {
      log = await PaymentLog.create({
        provider: "lynk",
        orderId: fields.orderId,
        transactionId: fields.transactionId,
        email: fields.email,
        whatsapp: fields.whatsapp,
        amount: fields.amount,
        packageName: fields.packageName,
        status: fields.status,
        rawPayload: payload,
        processed: false,
      });
    } else {
      log.email = fields.email ?? log.email;
      log.whatsapp = fields.whatsapp ?? log.whatsapp;
      log.amount = fields.amount ?? log.amount;
      log.packageName = fields.packageName ?? log.packageName;
      log.status = fields.status;
      log.rawPayload = payload;
    }

    // 5. Only proceed on a successful payment status.
    if (!isSuccessStatus(fields.status)) {
      log.processed = false;
      log.processingError = `NON_SUCCESS_STATUS:${fields.status}`;
      await log.save();
      return NextResponse.json({ ok: true, processed: false });
    }

    // 6. Match the payment to a user (email first, then whatsapp).
    const matchOr: Record<string, unknown>[] = [];
    if (fields.email) matchOr.push({ email: fields.email });
    if (fields.whatsapp) matchOr.push({ whatsapp: fields.whatsapp });

    const user =
      matchOr.length > 0 ? await User.findOne({ $or: matchOr }) : null;

    if (!user) {
      log.processed = false;
      log.processingError = "USER_NOT_FOUND";
      await log.save();
      console.warn(
        `[lynk webhook] user not found (email=${fields.email}, wa=${fields.whatsapp})`
      );
      return NextResponse.json({ ok: true, processed: false });
    }

    // 7. Activate / extend membership.
    const now = new Date();
    // True when there is still time left on the current period -> we extend it.
    const isRenewal =
      user.membershipStatus === "active" &&
      !!user.membershipEnd &&
      user.membershipEnd.getTime() > now.getTime();

    const newEnd = computeMembershipEnd(user.membershipEnd, now);

    if (!isRenewal) {
      // Fresh period (was pending/expired/blocked/new) -> start counts from now.
      user.membershipStart = now;
    }
    user.membershipStatus = "active";
    user.membershipEnd = newEnd;
    if (fields.packageName) user.packageName = fields.packageName;
    await user.save();

    log.userId = user._id;
    log.processed = true;
    log.processingError = null;
    await log.save();

    console.log(
      `[lynk webhook] activated user ${user.email} until ${newEnd.toISOString()}`
    );

    return NextResponse.json({ ok: true, processed: true });
  } catch (error) {
    console.error("[lynk webhook] processing error:", error);
    // Try to persist the failure without leaking internals to the caller.
    try {
      await PaymentLog.create({
        provider: "lynk",
        orderId: fields.orderId,
        transactionId: fields.transactionId,
        email: fields.email,
        whatsapp: fields.whatsapp,
        amount: fields.amount,
        status: fields.status,
        rawPayload: payload,
        processed: false,
        processingError: "INTERNAL_ERROR",
      });
    } catch {
      /* ignore secondary failure */
    }
    // Still return 200 so Lynk does not hammer us with retries.
    return NextResponse.json({ ok: true, processed: false });
  }
}

// A simple GET so the endpoint can be verified in a browser / health check.
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Lynk webhook endpoint is live. Send a POST request here.",
  });
}
