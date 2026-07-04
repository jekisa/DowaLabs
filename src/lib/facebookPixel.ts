export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "CompleteRegistration"
  | "StartTrial"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase";

export type MetaEventParameters = Record<
  string,
  string | number | boolean | string[] | undefined
>;

export interface MetaEventEnvelope {
  eventName: MetaStandardEvent;
  eventId: string;
  parameters: MetaEventParameters;
  eventSourceUrl: string;
  timestamp: number;
}

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  queue?: unknown[][];
  push?: MetaPixelFunction;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }
}

function createEventId(eventName: MetaStandardEvent) {
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${eventName}-${uniquePart}`;
}

export function trackMetaEvent(
  eventName: MetaStandardEvent,
  parameters: MetaEventParameters = {},
  options: { eventId?: string } = {}
): MetaEventEnvelope | null {
  if (typeof window === "undefined" || !window.fbq) return null;

  const envelope: MetaEventEnvelope = {
    eventName,
    eventId: options.eventId ?? createEventId(eventName),
    parameters,
    eventSourceUrl: window.location.href,
    timestamp: Math.floor(Date.now() / 1000),
  };

  window.fbq("track", eventName, parameters, { eventID: envelope.eventId });

  // A future CAPI bridge can listen for this event and forward the same
  // envelope/eventId to the server for browser/server event deduplication.
  window.dispatchEvent(
    new CustomEvent<MetaEventEnvelope>("meta:event", { detail: envelope })
  );

  return envelope;
}

export function trackMetaEventOnce(
  deduplicationKey: string,
  eventName: MetaStandardEvent,
  parameters: MetaEventParameters = {},
  options: { eventId?: string } = {}
) {
  if (typeof window === "undefined") return null;

  const storageKey = `meta-event:${deduplicationKey}`;
  try {
    if (window.localStorage.getItem(storageKey)) return null;
  } catch {
    // Tracking still works when storage is unavailable.
  }

  const envelope = trackMetaEvent(eventName, parameters, options);
  if (!envelope) return null;

  try {
    window.localStorage.setItem(storageKey, envelope.eventId);
  } catch {
    // The pixel event has already been queued; storage is only for deduping.
  }

  return envelope;
}

export const facebookPixel = {
  pageView: () => trackMetaEvent("PageView"),
  viewContent: (parameters: MetaEventParameters) =>
    trackMetaEvent("ViewContent", parameters),
  completeRegistration: (parameters: MetaEventParameters = {}) =>
    trackMetaEvent("CompleteRegistration", parameters),
  startTrial: (parameters: MetaEventParameters = {}) =>
    trackMetaEvent("StartTrial", parameters),
  initiateCheckout: (parameters: MetaEventParameters, eventId?: string) =>
    trackMetaEvent("InitiateCheckout", parameters, { eventId }),
  addPaymentInfo: (parameters: MetaEventParameters, eventId?: string) =>
    trackMetaEvent("AddPaymentInfo", parameters, { eventId }),
  purchase: (parameters: MetaEventParameters, eventId?: string) =>
    trackMetaEvent("Purchase", parameters, { eventId }),
};
