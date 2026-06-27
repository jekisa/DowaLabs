import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type MembershipStatus } from "@/lib/membership";

const VARIANT: Record<
  MembershipStatus,
  "default" | "success" | "warning" | "destructive" | "secondary"
> = {
  active: "success",
  pending: "warning",
  expired: "destructive",
  blocked: "destructive",
};

export function MembershipBadge({ status }: { status: MembershipStatus }) {
  return <Badge variant={VARIANT[status]}>{STATUS_LABELS[status]}</Badge>;
}
