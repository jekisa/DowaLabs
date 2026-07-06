import { MetadataRoute } from "next";
import { BRAND_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} - AI Product Studio`,
    short_name: BRAND_NAME,
    description:
      "Buat foto produk affiliate lebih menarik, premium, dan siap jual dengan bantuan AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#070810",
    theme_color: "#f5b942",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      // Idealnya Anda bisa menambahkan icon-192x192.png dan icon-512x512.png di folder public
      // lalu mendaftarkannya di sini.
    ],
  };
}
