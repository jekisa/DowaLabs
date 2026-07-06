"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#070810] p-6 text-center">
      <div className="rounded-full bg-red-500/10 p-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-white sm:text-3xl">
        Terjadi Kesalahan
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
        Maaf, ada yang tidak beres pada sistem kami. Silakan muat ulang halaman ini atau coba lagi nanti.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-8 gap-2"
        size="lg"
      >
        <RotateCcw className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
