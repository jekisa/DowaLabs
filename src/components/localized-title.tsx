"use client";

import { useEffect } from "react";
import { BRAND_NAME } from "@/lib/constants";
import { useLanguage } from "@/lib/language";

/**
 * Server `metadata` cannot see the language, which lives in a client context, so
 * pages whose title differs between ID and EN render this next to their content
 * and it retitles the tab once the language is known. The rest of the metadata
 * (description, openGraph, the `%s | BRAND` template) stays server-rendered and
 * untouched - this only mirrors that template for the title.
 */
export function LocalizedTitle({ id, en }: { id: string; en: string }) {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = `${language === "id" ? id : en} | ${BRAND_NAME}`;
  }, [language, id, en]);

  return null;
}
