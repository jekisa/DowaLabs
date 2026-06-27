import { Users, UserCheck, Clock, UserX, Receipt, AlertTriangle } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PaymentLog } from "@/models/PaymentLog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectToDatabase();
  const [total, active, pending, expired, blocked, payments, unprocessed] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ membershipStatus: "active" }),
      User.countDocuments({ membershipStatus: "pending" }),
      User.countDocuments({ membershipStatus: "expired" }),
      User.countDocuments({ membershipStatus: "blocked" }),
      PaymentLog.countDocuments({}),
      PaymentLog.countDocuments({ processed: false }),
    ]);
  return { total, active, pending, expired, blocked, payments, unprocessed };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Users", value: stats.total, icon: Users },
    { label: "Active", value: stats.active, icon: UserCheck },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "Expired", value: stats.expired, icon: UserX },
    { label: "Blocked", value: stats.blocked, icon: UserX },
    { label: "Payment Logs", value: stats.payments, icon: Receipt },
    { label: "Unprocessed", value: stats.unprocessed, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan user dan pembayaran DowaLabs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-gold-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
