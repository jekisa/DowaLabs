import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/server-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") redirect("/login?from=/admin");
  if (error === "FORBIDDEN" || !user) redirect("/dashboard");

  return (
    <AdminShell user={{ name: user.name, email: user.email }}>
      {children}
    </AdminShell>
  );
}
