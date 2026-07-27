import crypto from "crypto";
import type { PackageName } from "@/lib/membership";

type AnyRecord = Record<string, unknown>;

export const DOKU_CHECKOUT_PATH = "/checkout/v1/payment";

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getNested(payload: AnyRecord, path: string[]): unknown {
  let current: unknown = payload;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

function deepFind(payload: unknown, keys: string[], depth = 0): unknown {
  if (depth > 6 || !isRecord(payload)) return undefined;
  const lowered = keys.map((key) => key.toLowerCase());

  for (const [key, value] of Object.entries(payload)) {
    if (lowered.includes(key.toLowerCase()) && value !== null && value !== "") {
      return value;
    }
  }

  for (const value of Object.values(payload)) {
    const found = deepFind(value, keys, depth + 1);
    if (found !== undefined) return found;
  }

  return undefined;
}

export function getDokuBaseUrl(): string {
  return process.env.DOKU_ENV?.toLowerCase() === "production"
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";
}

export function getDokuCheckoutJsUrl(): string {
  return process.env.DOKU_ENV?.toLowerCase() === "production"
    ? "https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js"
    : "https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js";
}

export function isDokuConfigured(): boolean {
  return Boolean(process.env.DOKU_CLIENT_ID && process.env.DOKU_SECRET_KEY);
}

export function createDokuDigest(rawBody: string): string {
  return crypto.createHash("sha256").update(rawBody).digest("base64");
}

export function createDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  digest,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  digest: string;
  secretKey: string;
}): string {
  const component = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:${requestTarget}`,
    `Digest:${digest}`,
  ].join("\n");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(component)
    .digest("base64");

  return `HMACSHA256=${signature}`;
}

export function verifyDokuSignature({
  headers,
  rawBody,
  requestTarget,
}: {
  headers: Headers;
  rawBody: string;
  requestTarget: string;
}): boolean {
  const clientId = headers.get("client-id");
  const requestId = headers.get("request-id");
  const requestTimestamp = headers.get("request-timestamp");
  const signature = headers.get("signature");
  const secretKey = process.env.DOKU_SECRET_KEY;

  if (!clientId || !requestId || !requestTimestamp || !signature || !secretKey) {
    return false;
  }

  const expected = createDokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest: createDokuDigest(rawBody),
    secretKey,
  });

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export interface ParsedDokuNotification {
  invoiceNumber: string | null;
  transactionId: string | null;
  amount: number | null;
  status: string;
  paymentMethod: string | null;
  email: string | null;
  packageName: PackageName | null;
}

export function parseDokuNotification(payload: unknown): ParsedDokuNotification {
  const safe = isRecord(payload) ? payload : {};
  const invoiceNumber = asString(getNested(safe, ["order", "invoice_number"]));
  const transactionId =
    asString(getNested(safe, ["payment", "id"])) ||
    asString(getNested(safe, ["payment", "payment_id"])) ||
    asString(getNested(safe, ["transaction", "id"])) ||
    asString(deepFind(safe, ["transaction_id", "transactionId"]));
  const amount =
    asNumber(getNested(safe, ["order", "amount"])) ||
    asNumber(deepFind(safe, ["amount", "gross_amount"]));
  const status =
    asString(getNested(safe, ["transaction", "status"])) ||
    asString(getNested(safe, ["payment", "status"])) ||
    asString(deepFind(safe, ["status", "transaction_status"])) ||
    "unknown";
  const paymentMethod =
    asString(getNested(safe, ["payment", "method"])) ||
    asString(getNested(safe, ["payment", "channel"])) ||
    asString(deepFind(safe, ["payment_method", "paymentMethod", "channel"]));
  const email =
    asString(getNested(safe, ["customer", "email"]))?.toLowerCase() ||
    asString(deepFind(safe, ["email", "customer_email"]))?.toLowerCase() ||
    null;

  return {
    invoiceNumber,
    transactionId,
    amount,
    status,
    paymentMethod,
    email,
    packageName: "pro",
  };
}

export function isDokuPaidStatus(status: string): boolean {
  return ["success", "paid", "settlement", "settled", "capture", "completed"].includes(
    status.trim().toLowerCase()
  );
}
