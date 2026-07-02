import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { serializeUser } from "@/lib/serialize";
import { UsersManager } from "@/components/admin/users-manager";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectToDatabase();
  const users = await User.find({}).sort({ createdAt: -1 }).limit(200);
  const data = users.map(serializeUser);

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Member directory" title="User Management" description="Kelola role, status membership, paket, dan masa aktif seluruh user." icon={Users} />
      <UsersManager initialUsers={data} />
    </div>
  );
}
