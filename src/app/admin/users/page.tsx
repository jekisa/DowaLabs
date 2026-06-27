import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { serializeUser } from "@/lib/serialize";
import { UsersManager } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectToDatabase();
  const users = await User.find({}).sort({ createdAt: -1 }).limit(200);
  const data = users.map(serializeUser);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Kelola status membership, paket, dan masa aktif user.
        </p>
      </div>
      <UsersManager initialUsers={data} />
    </div>
  );
}
