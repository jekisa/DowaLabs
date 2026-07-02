"use client";

import {
  type ShowcaseVideo,
  VideoShowcaseCarousel,
} from "@/components/landing/VideoShowcaseCarousel";

const videos: ShowcaseVideo[] = [
  {
    title: "Prompt Video Produk",
    description: "Visual produk untuk konten utama",
    src: "/videos/demo-1.mp4",
  },
  {
    title: "Prompt Video Detail",
    description: "Close-up detail dan tekstur produk",
    src: "/videos/demo-2.mp4",
  },
  {
    title: "Prompt Video Promosi",
    description: "Video singkat untuk campaign",
    src: "/videos/demo-3.mp4",
  },
];

export function DemoVideo() {
  return <VideoShowcaseCarousel videos={videos} />;
}
