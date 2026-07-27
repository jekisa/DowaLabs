import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";
import { Toaster } from "@/components/ui/sonner";
import { BRAND_NAME } from "@/lib/constants";
import { LanguageProvider } from "@/lib/language";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  themeColor: "#070810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} - AI Product Studio`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Buat foto produk affiliate lebih menarik, premium, dan siap jual dengan bantuan AI. Membership DowaLabs AI Product Studio.",
  keywords: [
    "DowaLabs",
    "AI Product Studio",
    "foto produk AI",
    "affiliate",
    "seller Shopee",
    "UMKM",
  ],
  openGraph: {
    title: `${BRAND_NAME} - AI Product Studio`,
    description: "Buat foto produk affiliate lebih menarik, premium, dan siap jual dengan bantuan AI.",
    url: "https://dowa-labs.vercel.app/",
    siteName: BRAND_NAME,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} - AI Product Studio`,
    description: "Buat foto produk affiliate lebih menarik, premium, dan siap jual dengan bantuan AI.",
  },
  icons: {
    icon: [
      {
        url: "/images/brand/dowa-logo.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/brand/dowa-logo.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${sans.variable} font-sans`}>
        <LanguageProvider>{children}</LanguageProvider>
        <Suspense fallback={null}>
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
