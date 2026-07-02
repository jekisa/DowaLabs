import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { computeMembershipEnd, isSuccessStatus } from "@/lib/membership";
import { parseLynkPayload, verifyWebhookSecret } from "@/lib/lynk";
import { PaymentLog } from "@/models/PaymentLog";
import { User } from "@/models/User";

export const runtime = "nodejs";

function response(fields: Record<string, unknown> = {}) {
  return NextResponse.json({ success: true, ...fields });
}

export async function POST(req: NextRequest) {
  let rawText = "";
  let payload: Record<string, unknown> = {};

  try {
    rawText = await req.text();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      payload =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? (parsed as Record<string, unknown>)
          : { value: parsed };
    }
  } catch {
    payload = { rawText };
  }

  const fields = parseLynkPayload(payload);
  let currentLogId: string | null = null;

  try {
    await connectToDatabase();

    const log = await PaymentLog.create({
      provider: "lynk",
      orderId: fields.orderId,
      transactionId: fields.transactionId,
      amount: fields.amount,
      status: fields.status,
      productName: fields.productName,
      email: fields.email,
      whatsapp: fields.whatsapp,
      packageName: fields.packageName,
      rawPayload: payload,
      processed: false,
      processingNote: null,
    });
    currentLogId = log._id.toString();

    if (!verifyWebhookSecret(req.headers, payload)) {
      log.processingNote = "Invalid webhook secret";
      await log.save();
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const duplicateConditions: Record<string, unknown>[] = [];
    if (fields.orderId) duplicateConditions.push({ orderId: fields.orderId });
    if (fields.transactionId) {
      duplicateConditions.push({ transactionId: fields.transactionId });
    }

    if (duplicateConditions.length > 0) {
      const duplicate = await PaymentLog.findOne({
        _id: { $ne: log._id },
        processed: true,
        $or: duplicateConditions,
      });

      if (duplicate) {
        log.processed = true;
        log.processingNote = "Duplicate transaction";
        await log.save();
        return response({ processed: true, duplicate: true });
      }
    }

    if (!isSuccessStatus(fields.status)) {
      log.processingNote = "Status is not successful";
      await log.save();
      return response({ processed: false });
    }

    let user = fields.email
      ? await User.findOne({ email: fields.email.toLowerCase() })
      : null;
    if (!user && fields.whatsapp) {
      user = await User.findOne({ whatsapp: fields.whatsapp });
    }

    if (!user) {
      log.processingNote = "User not found";
      await log.save();
      return response({ processed: false });
    }

    const now = new Date();
    const hasActivePeriod =
      user.membershipStatus === "active" &&
      !!user.membershipEnd &&
      user.membershipEnd.getTime() > now.getTime();

    if (!hasActivePeriod) user.membershipStart = now;
    user.membershipStatus = "active";
    user.membershipEnd = computeMembershipEnd(user.membershipEnd, now);
    user.packageName = "pro";
    await user.save();

    log.userId = user._id;
    log.processed = true;
    log.processingNote = "User activated";
    await log.save();

    return response({ processed: true });
  } catch (error) {
    console.error("[lynk webhook] processing failed");

    if (currentLogId) {
      try {
        await PaymentLog.findByIdAndUpdate(currentLogId, {
          processed: false,
          processingNote: "Internal processing error",
        });
      } catch {
        // The original payload was already persisted when possible.
      }
    } else {
      try {
        await connectToDatabase();
        await PaymentLog.create({
          provider: "lynk",
          orderId: fields.orderId,
          transactionId: fields.transactionId,
          amount: fields.amount,
          status: fields.status,
          productName: fields.productName,
          email: fields.email,
          whatsapp: fields.whatsapp,
          rawPayload: payload,
          processed: false,
          processingNote: "Internal processing error",
        });
      } catch {
        // MongoDB is unavailable; do not leak the connection error.
      }
    }

    void error;
    return response({ processed: false });
  }
}

export async function GET() {
  return response({ message: "Lynk webhook endpoint is ready" });
}
