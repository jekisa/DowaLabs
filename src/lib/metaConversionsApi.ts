import crypto from "crypto";

export interface MetaCapiEvent {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  value?: number;
  currency?: string;
  email?: string;
  whatsapp?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  parameters?: Record<string, any>;
}

/**
 * Sends a server-side event to Meta Conversions API (CAPI).
 * Ensures correct hashing of PII fields (email, WhatsApp) and formatting of telephone numbers.
 */
export async function sendMetaCapiEvent(event: MetaCapiEvent) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn(
      "[Meta CAPI] Skipping event send. NEXT_PUBLIC_META_PIXEL_ID or META_ACCESS_TOKEN is missing."
    );
    return;
  }

  // SHA-256 Hash helper for string data
  const hash = (val?: string) => {
    if (!val) return undefined;
    const clean = val.trim().toLowerCase();
    return crypto.createHash("sha256").update(clean).digest("hex");
  };

  // SHA-256 Hash helper specifically formatted for WhatsApp (phone number) matching rules
  const hashPhone = (val?: string) => {
    if (!val) return undefined;
    // Keep only numbers
    let clean = val.replace(/\D/g, "");
    // Format to Indonesian country code prefix (62)
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    } else if (clean.startsWith("8")) {
      clean = "62" + clean;
    }
    return crypto.createHash("sha256").update(clean).digest("hex");
  };

  const userData: Record<string, any> = {};

  if (event.clientIp) userData.client_ip_address = event.clientIp;
  if (event.userAgent) userData.client_user_agent = event.userAgent;
  if (event.fbp) userData.fbp = event.fbp;
  if (event.fbc) userData.fbc = event.fbc;

  const hashedEmail = hash(event.email);
  if (hashedEmail) userData.em = [hashedEmail];

  const hashedPhone = hashPhone(event.whatsapp);
  if (hashedPhone) userData.ph = [hashedPhone];

  // Combine standard parameters and custom event parameters
  const customData: Record<string, any> = { ...event.parameters };
  if (event.value !== undefined) customData.value = event.value;
  if (event.currency) customData.currency = event.currency;

  const payload: Record<string, any> = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url:
          event.eventSourceUrl ||
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/`,
        action_source: "website",
        user_data: userData,
        custom_data: Object.keys(customData).length > 0 ? customData : undefined,
      },
    ],
  };

  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) {
    payload.test_event_code = testCode;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("[Meta CAPI] Error response from Facebook API:", data);
    } else {
      console.log(
        `[Meta CAPI] Event "${event.eventName}" sent successfully. (Event ID: ${event.eventId})`,
        data
      );
    }
  } catch (err) {
    console.error("[Meta CAPI] Network error sending event:", err);
  }
}
