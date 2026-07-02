import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { getAppSettings } from "@/models/AppSettings";
import { EMPTY_CANVAS_LINKS } from "@/lib/canvas-tools";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user } = await requireAuth();
  if (!user) redirect("/login?from=/dashboard");

  const safeUser = serializeUser(user);
  const settings = await getAppSettings();

  const canvasLinks = safeUser.canAccessCanvas
    ? {
        productStudio: settings.canvasUrl || null,
        backgroundRemover: settings.backgroundRemoverUrl || null,
        colorGrading: settings.colorGradingUrl || null,
        portraitStyle: settings.portraitStyleUrl || null,
        promptAi: settings.promptAiUrl || null,
      }
    : EMPTY_CANVAS_LINKS;

  return (
    <DashboardLayout
      user={safeUser}
      canvasLinks={canvasLinks}
    />
  );
}
