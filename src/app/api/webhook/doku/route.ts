import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { computeMembershipEnd } from "@/lib/membership";
import {
  isDokuPaidStatus,
  parseDokuNotification,
  verifyDokuSignature,
} from "@/lib/doku";
import { PaymentInvoice } from "@/models/PaymentInvoice";
import { PaymentLog } from "@/models/PaymentLog";
import { User } from "@/models/User";

export const runtime = "nodejs";

function response(fields: Record<string, unknown> = {}) {
  return NextResponse.json({ success: true, ...fields });
}

export async function POST(req: NextRequest) {
  const rawText = await req.text();
  let payload: Record<string, unknown> = {};

  try {
    const parsed = rawText ? JSON.parse(rawText) : {};
    payload =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : { value: parsed };
  } catch {
    payload = { rawText };
  }

  const fields = parseDokuNotification(payload);
  let currentLogId: string | null = null;

  try {
    await connectToDatabase();

    const log = await PaymentLog.create({
      provider: "doku",
      orderId: fields.invoiceNumber,
      transactionId: fields.transactionId,
      amount: fields.amount,
      status: fields.status,
      productName: fields.paymentMethod,
      email: fields.email,
      whatsapp: null,
      packageName: fields.packageName,
      rawPayload: payload,
      processed: false,
      processingNote: null,
    });
    currentLogId = log._id.toString();

    if (
      !verifyDokuSignature({
        headers: req.headers,
        rawBody: rawText,
        requestTarget: "/api/webhook/doku",
      })
    ) {
      log.processingNote = "Invalid DOKU signature";
      await log.save();
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    if (!fields.invoiceNumber) {
      log.processingNote = "Missing invoice number";
      await log.save();
      return response({ processed: false });
    }

    const duplicate = await PaymentLog.findOne({
      _id: { $ne: log._id },
      provider: "doku",
      orderId: fields.invoiceNumber,
      processed: true,
    });

    if (duplicate) {
      log.processed = true;
      log.processingNote = "Duplicate transaction";
      await log.save();
      return response({ processed: true, duplicate: true });
    }

    if (!isDokuPaidStatus(fields.status)) {
      log.processingNote = "Status is not successful";
      await log.save();
      return response({ processed: false });
    }

    const invoice = await PaymentInvoice.findOne({
      invoiceNumber: fields.invoiceNumber,
    });

    if (!invoice) {
      log.processingNote = "Invoice not found";
      await log.save();
      return response({ processed: false });
    }

    const user = await User.findById(invoice.userId);
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
    user.membershipEnd = computeMembershipEnd(user.membershipEnd, now, invoice.durationDays);
    user.packageName = "pro";
    await user.save();

    invoice.status = "approved";
    invoice.reviewedAt = now;
    invoice.adminNote = "Auto-approved by DOKU Checkout notification";
    invoice.subscriptionStart = user.membershipStart;
    invoice.subscriptionEnd = user.membershipEnd;
    await invoice.save();

    log.userId = user._id;
    log.processed = true;
    log.processingNote = "User activated";
    await log.save();

    return response({ processed: true });
  } catch (error) {
    console.error("[doku webhook] processing failed:", error);

    if (currentLogId) {
      await PaymentLog.findByIdAndUpdate(currentLogId, {
        processed: false,
        processingNote: "Internal processing error",
      }).catch(() => undefined);
    }

    return response({ processed: false });
  }
}

export async function GET() {
  return response({ message: "DOKU webhook endpoint is ready" });
}
