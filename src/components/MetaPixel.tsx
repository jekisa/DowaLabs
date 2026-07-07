"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { facebookPixel, type MetaEventEnvelope } from "@/lib/facebookPixel";

const VIEW_CONTENT_ROUTES: Record<
  string,
  { content_name: string; content_category: string; content_ids: string[] }
> = {
  "/": {
    content_name: "DowaLabs AI Product Studio",
    content_category: "Landing Page",
    content_ids: ["landing"],
  },
  "/pricing": {
    content_name: "Paket Pro",
    content_category: "Pricing",
    content_ids: ["pro"],
  },
  "/demo": {
    content_name: "Demo AI Product Studio",
    content_category: "Demo",
    content_ids: ["demo"],
  },
};

export function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const lastTrackedUrl = useRef<string | null>(null);
  const validPixelId = useMemo(
    () => (pixelId && /^\d+$/.test(pixelId) ? pixelId : null),
    [pixelId]
  );
  const query = searchParams.toString();
  const routeUrl = query ? `${pathname}?${query}` : pathname;

  useEffect(() => {
    if (!validPixelId) return;

    if (!window.fbq) {
      const fbq: NonNullable<Window["fbq"]> = (...args: unknown[]) => {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue?.push(args);
        }
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.dataset.metaPixel = "true";
      document.head.appendChild(script);

      window.fbq("init", validPixelId);
    }

    setInitialized(true);
  }, [validPixelId]);

  useEffect(() => {
    if (!initialized || lastTrackedUrl.current === routeUrl) return;

    lastTrackedUrl.current = routeUrl;
    facebookPixel.pageView();

    const content = VIEW_CONTENT_ROUTES[pathname];
    if (content) {
      facebookPixel.viewContent({
        ...content,
        content_type: "product",
      });
    }
  }, [initialized, pathname, routeUrl]);

  useEffect(() => {
    const handleMetaEvent = (e: Event) => {
      const customEvent = e as CustomEvent<MetaEventEnvelope>;
      const envelope = customEvent.detail;

      fetch("/api/meta/capi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(envelope),
      }).catch((err) => {
        console.error("Failed to forward event to Meta Conversions API:", err);
      });
    };

    window.addEventListener("meta:event", handleMetaEvent);
    return () => {
      window.removeEventListener("meta:event", handleMetaEvent);
    };
  }, []);

  return null;
}
