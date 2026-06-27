import { connectToDatabase } from "@/lib/mongodb";
import { PaymentLog } from "@/models/PaymentLog";
import { serializePaymentLog } from "@/lib/serialize";
import { PaymentsTable } from "@/components/admin/payments-table";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await connectToDatabase();
  const logs = await PaymentLog.find({}).sort({ createdAt: -1 }).limit(200);
  const data = logs.map(serializePaymentLog);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Logs</h1>
        <p className="text-sm text-muted-foreground">
          Semua payload webhook Lynk yang masuk, termasuk yang belum cocok
          dengan user.
        </p>
      </div>
      <PaymentsTable payments={data} />
    </div>
  );
}
