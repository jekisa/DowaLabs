import { ShieldCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PaymentsTable } from "@/components/admin/payments-table";
import { connectToDatabase } from "@/lib/mongodb";
import { PaymentLog } from "@/models/PaymentLog";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await connectToDatabase();
  const payments = await PaymentLog.find({ provider: "duitku" })
    .sort({ createdAt: -1 })
    .limit(300);

  const data = payments.map((payment) => ({
    id: payment._id.toString(),
    orderId: payment.orderId,
    transactionId: payment.transactionId,
    email: payment.email,
    whatsapp: payment.whatsapp,
    amount: payment.amount,
    status: payment.status,
    processed: payment.processed,
    processingNote: payment.processingNote,
    rawPayload: payment.rawPayload,
    createdAt: payment.createdAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Duitku payment logs"
        title="Riwayat Pembayaran"
        description="Pantau notifikasi pembayaran Duitku dan status aktivasi membership."
        icon={ShieldCheck}
      />
      <PaymentsTable payments={data} />
    </div>
  );
}
