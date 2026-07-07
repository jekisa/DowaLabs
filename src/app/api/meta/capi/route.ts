import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { sendMetaCapiEvent } from "@/lib/metaConversionsApi";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { eventName, eventId, parameters, eventSourceUrl } = body;

    if (!eventName || !eventId) {
      return fail("Nama event dan Event ID wajib disertakan", 400);
    }

    // Extract user details if logged in to improve match rate
    let email: string | undefined;
    let whatsapp: string | undefined;

    try {
      const user = await getCurrentUser();
      if (user) {
        email = user.email;
        whatsapp = user.whatsapp;
      }
    } catch (err) {
      // Non-blocking if auth fails or database is offline during public event
      console.warn("[Meta CAPI Route] Failed to fetch session user:", err);
    }

    // Extract client cookies, IP and User Agent
    const cookieStore = await cookies();
    const fbp = cookieStore.get("_fbp")?.value;
    const fbc = cookieStore.get("_fbc")?.value;

    const clientIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    // Send CAPI event
    await sendMetaCapiEvent({
      eventName,
      eventId,
      eventSourceUrl,
      value: parameters?.value,
      currency: parameters?.currency,
      email,
      whatsapp,
      clientIp,
      userAgent,
      fbp,
      fbc,
      parameters,
    });

    return ok({ message: "Event berhasil dikirim ke Meta Conversions API" });
  } catch (error) {
    console.error("[Meta CAPI Route] Error forwarding event:", error);
    return fail("Gagal memproses event Conversions API", 500);
  }
}
