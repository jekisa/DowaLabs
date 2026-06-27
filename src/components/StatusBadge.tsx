import { cn } from "@/lib/utils";

type Status = "active" | "pending" | "expired" | "blocked";

const styles: Record<Status, string> = {
  active: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  pending: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  expired: "border-slate-400/25 bg-slate-400/10 text-slate-300",
  blocked: "border-red-400/25 bg-red-400/10 text-red-300",
};

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize",
        styles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
