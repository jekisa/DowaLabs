import crypto from "crypto";
import type { PackageName } from "@/lib/membership";

export const DUITKU_CREATE_INVOICE_PATH = "/api/merchant/createInvoice";
export function getDuitkuBaseUrl() { return process.env.DUITKU_ENV?.toLowerCase() === "production" ? "https://api-prod.duitku.com" : "https://api-sandbox.duitku.com"; }
export function isDuitkuConfigured() { return Boolean(process.env.DUITKU_MERCHANT_CODE && process.env.DUITKU_API_KEY); }
// Duitku's POP API expects an HMAC-SHA256 signature for the request headers.
// The older plain SHA-256 variant is rejected by the current API.
export function createDuitkuRequestSignature(merchantCode: string, timestamp: string) {
  return crypto
    .createHmac("sha256", process.env.DUITKU_API_KEY!)
    .update(merchantCode + timestamp)
    .digest("hex");
}
export function createDuitkuCallbackSignature(merchantCode: string, amount: string, orderId: string) { return crypto.createHmac("sha256", process.env.DUITKU_API_KEY!).update(merchantCode + amount + orderId).digest("hex"); }
export function safeEqual(a: string, b: string) { const x = Buffer.from(a.toLowerCase()), y = Buffer.from(b.toLowerCase()); return x.length === y.length && crypto.timingSafeEqual(x, y); }
export function isDuitkuPaidStatus(status: unknown) { return String(status) === "00" || ["success", "paid", "settlement", "completed"].includes(String(status).toLowerCase()); }
export interface ParsedDuitkuNotification { invoiceNumber: string | null; transactionId: string | null; amount: number | null; status: string; email: string | null; packageName: PackageName; }
export function parseDuitkuNotification(p: Record<string, unknown>): ParsedDuitkuNotification { const s=(k:string)=>p[k] == null ? null : String(p[k]); const n=Number(s("amount")); return { invoiceNumber:s("merchantOrderId"), transactionId:s("reference") || s("publisherOrderId"), amount:Number.isFinite(n)?n:null, status:s("resultCode") || s("statusCode") || "unknown", email:s("email")?.toLowerCase() || null, packageName:"pro" }; }
