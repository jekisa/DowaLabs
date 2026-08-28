import { connectToDatabase } from "@/lib/mongodb";
import { serializeManualPayment } from "@/lib/manual-payment";
import { ManualPayment } from "@/models/ManualPayment";
import { User } from "@/models/User";
import { ManualPaymentsTable } from "@/components/admin/manual-payments-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await connectToDatabase();
  const payments = await ManualPayment.find({}).sort({ createdAt: -1 }).limit(300);
  const userIds = [...new Set(payments.map((payment) => payment.userId.toString()))];
  const users = await User.find({ _id: { $in: userIds } }).select("name email whatsapp");
  const userMap = new Map(
    users.map((user) => [
      user._id.toString(),
      { name: user.name, email: user.email, whatsapp: user.whatsapp },
    ])
  );
  const data = payments.map((payment) => ({
    ...serializeManualPayment(payment),
    user: userMap.get(payment.userId.toString()) ?? null,
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Payment review" title="Verifikasi Transfer" description="Periksa bukti transfer, pilih durasi langganan, lalu aktifkan atau perpanjang subscription." icon={ShieldCheck} />
      <ManualPaymentsTable initialPayments={data} />
    </div>
  );
}
