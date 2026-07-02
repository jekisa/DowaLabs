"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatIDR } from "@/lib/utils";

interface PaymentRow {
  id: string;
  orderId: string | null;
  transactionId: string | null;
  email: string | null;
  whatsapp: string | null;
  amount: number | null;
  status: string;
  processed: boolean;
  processingNote: string | null;
  rawPayload: Record<string, unknown>;
  createdAt: string | null;
}

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const [viewing, setViewing] = useState<PaymentRow | null>(null);

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Order / Trx</TableHead>
              <TableHead>Email / WA</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proses</TableHead>
              <TableHead className="text-right">Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Belum ada payment log.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs">
                    {formatDate(p.createdAt)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>{p.orderId || "-"}</div>
                    <div className="text-muted-foreground">
                      {p.transactionId || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>{p.email || "-"}</div>
                    <div className="text-muted-foreground">
                      {p.whatsapp || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {p.amount != null ? formatIDR(p.amount) : "-"}
                  </TableCell>
                  <TableCell className="text-xs">{p.status}</TableCell>
                  <TableCell>
                    {p.processed ? (
                      <Badge variant="success">processed</Badge>
                    ) : (
                      <Badge variant="warning">
                        {p.processingNote || "unprocessed"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setViewing(p)}
                      title="Lihat payload"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!viewing}
        onOpenChange={(o) => {
          if (!o) setViewing(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Raw Payload</DialogTitle>
            <DialogDescription>
              {viewing?.orderId || viewing?.transactionId || viewing?.id}
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-[60vh] overflow-auto rounded-lg bg-navy-950 p-4 text-xs text-muted-foreground">
            {JSON.stringify(viewing?.rawPayload ?? {}, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
