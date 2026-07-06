import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#070810]">
      <Loader2 className="h-10 w-10 animate-spin text-amber-300" />
      <p className="mt-4 text-sm font-medium text-slate-400">Memuat...</p>
    </div>
  );
}
