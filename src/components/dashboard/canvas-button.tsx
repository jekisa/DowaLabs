"use client";

import { ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MembershipStatus } from "@/lib/membership";

export function CanvasButton({
  canAccess,
  canvasUrl,
  status,
}: {
  canAccess: boolean;
  canvasUrl: string | null;
  status: MembershipStatus;
}) {
  if (!canAccess) {
    return (
      <Button size="lg" className="w-full sm:w-auto" disabled>
        <Lock className="h-4 w-4" />
        Buka DowaLabs AI Canvas
      </Button>
    );
  }

  function open() {
    if (!canvasUrl) {
      toast.error(
        "Link Canvas belum diatur. Silakan hubungi admin DowaLabs."
      );
      return;
    }
    window.open(canvasUrl, "_blank", "noopener,noreferrer");
  }

  // status is "active" here; kept for clarity/extension.
  void status;

  return (
    <Button size="lg" className="w-full sm:w-auto" onClick={open}>
      Buka DowaLabs AI Canvas <ExternalLink className="h-4 w-4" />
    </Button>
  );
}
