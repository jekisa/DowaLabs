import type { Metadata } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardLayout />;
}
