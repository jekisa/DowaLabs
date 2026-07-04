import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";
import { Toaster } from "@/components/ui/sonner";
import { BRAND_NAME } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans`}>
        {children}
        <Suspense fallback={null}>
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}

