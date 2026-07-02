"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ADMIN_ITEMS: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Verifikasi Transfer", icon: Receipt },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi admin" className="grid gap-1.5">
      {ADMIN_ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
              active
                ? "bg-gradient-to-r from-amber-300/[0.14] to-transparent font-medium text-white shadow-[inset_0_0_0_1px_rgba(245,185,66,0.12)]"
                : "text-slate-400 hover:translate-x-0.5 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            {active && (
              <motion.span
                layoutId="admin-active-nav"
                className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,185,66,0.8)]"
              />
            )}
            <Icon
              className={cn(
                "h-[18px] w-[18px] transition-colors",
                active
                  ? "text-amber-300"
                  : "text-slate-500 group-hover:text-slate-300"
              )}
            />
            {item.label}
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
