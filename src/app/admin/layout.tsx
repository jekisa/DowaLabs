import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { requireAdmin } from "@/lib/server-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/auth/logout-button";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth (middleware already guards /admin).
  const { user, error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") redirect("/login?from=/admin");
  if (error === "FORBIDDEN" || !user) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-navy-950/60 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            {BRAND_NAME}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Lihat sebagai user
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container grid gap-8 py-8 md:grid-cols-[200px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <AdminSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
