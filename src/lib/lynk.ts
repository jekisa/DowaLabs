import type { PackageName } from "@/lib/membership";
import { normalizeWhatsapp } from "@/lib/whatsapp";

/**
 * Lynk.id webhook payloads are not strongly standardized, so we defensively
 * look for values under many possible key names and nesting levels.
 */

type AnyRecord = Record<string, unknown>;

function isObject(v: unknown): v is AnyRecord {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-search the payload for the first defined value under any of `keys`. */
function deepFind(payload: unknown, keys: string[], depth = 0): unknown {
  if (depth > 6 || !isObject(payload)) return undefined;
  const lowered = keys.map((k) => k.toLowerCase());

  for (const [rawKey, value] of Object.entries(payload)) {
    if (lowered.includes(rawKey.toLowerCase())) {
      if (value !== null && value !== undefined && value !== "") return value;
    }
  }
  // Recurse into nested objects (e.g. payload.data.customer.email).
  for (const value of Object.values(payload)) {
    if (isObject(value)) {
      const found = deepFind(value, keys, depth + 1);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function asString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return null;
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    const n = Number(cleaned);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function guessPackage(...candidates: (string | null)[]): PackageName | null {
  for (const c of candidates) {
    if (!c) continue;
    const lc = c.toLowerCase();
    if (lc.includes("pro")) return "pro";
    if (lc.includes("basic")) return "basic";
  }
  return null;
}

export interface ParsedLynkPayload {
  orderId: string | null;
  transactionId: string | null;
  email: string | null;
  whatsapp: string | null;
  amount: number | null;
  status: string;
  productName: string | null;
  packageName: PackageName | null;
}

export function parseLynkPayload(payload: unknown): ParsedLynkPayload {
  const safe = isObject(payload) ? payload : {};

  const orderId = asString(
    deepFind(safe, [
      "orderId",
      "order_id",
      "order",
      "invoiceId",
      "invoice_id",
      "refId",
      "ref_id",
      "reference",
    ])
  );

  const transactionId = asString(
    deepFind(safe, [
      "transactionId",
      "transaction_id",
      "trxId",
      "trx_id",
      "txnId",
      "txn_id",
      "paymentId",
      "payment_id",
      "id",
    ])
  );

  const email = asString(
    deepFind(safe, [
      "email",
      "customerEmail",
      "customer_email",
      "buyerEmail",
      "buyer_email",
      "payerEmail",
    ])
  )?.toLowerCase() ?? null;

  const whatsappValue = normalizeWhatsapp(
    asString(
      deepFind(safe, [
        "whatsapp",
        "phone",
        "phoneNumber",
        "phone_number",
        "customerPhone",
        "customer_phone",
        "buyerPhone",
        "msisdn",
        "wa",
      ])
    )
  );
  const whatsapp = whatsappValue || null;

  const amount = asNumber(
    deepFind(safe, ["amount", "total", "grossAmount", "gross_amount", "price", "nominal"])
  );

  const status =
    asString(
      deepFind(safe, [
        "status",
        "paymentStatus",
        "payment_status",
        "transactionStatus",
        "transaction_status",
        "event",
        "eventType",
      ])
    ) ?? "unknown";

  const productName = asString(
    deepFind(safe, [
      "productName",
      "product_name",
      "product",
      "itemName",
      "item_name",
      "planName",
      "package",
      "packageName",
    ])
  );

  const packageName = guessPackage(productName, asString(deepFind(safe, ["package", "packageName", "plan"])));

  return {
    orderId,
    transactionId,
    email,
    whatsapp,
    amount,
    status: status.toString(),
    productName,
    packageName,
  };
}

/**
 * Verify the optional Lynk webhook secret.
 * Returns true when no secret is configured (accept + log), or when the
 * provided header/payload secret matches the configured one.
 */
export function verifyWebhookSecret(
  headers: Headers,
  payload: unknown
): boolean {
  const expected = process.env.LYNK_WEBHOOK_SECRET;
  // TODO: Replace this comparison with Lynk's documented signature algorithm
  // when official signature details are available.
  if (!expected) return true;

  const headerSecret =
    headers.get("x-lynk-signature") ||
    headers.get("x-webhook-secret") ||
    headers.get("x-signature") ||
    headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const payloadSecret = isObject(payload)
    ? asString(payload.secret ?? payload.signature ?? payload.token)
    : null;

  return headerSecret === expected || payloadSecret === expected;
}
