"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ImagePreviewModalProps = {
  src: string | null;
  alt?: string;
  onClose: () => void;
};

export function ImagePreviewModal({
  src,
  alt = "Preview gambar DowaLabs",
  onClose,
}: ImagePreviewModalProps) {
  return (
    <Dialog open={Boolean(src)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[90vh] w-[94vw] max-w-6xl overflow-hidden rounded-2xl border-white/10 bg-[#05060b]/95 p-2 sm:p-3">
        <DialogTitle className="sr-only">Preview gambar</DialogTitle>
        <DialogDescription className="sr-only">
          Gambar ditampilkan dalam ukuran besar tanpa terpotong.
        </DialogDescription>
        {src && (
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-white/[0.03]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="94vw"
              className="object-contain"
              priority
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
