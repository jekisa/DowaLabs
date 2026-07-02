import { getAppSettings } from "@/models/AppSettings";
import { serializeSettings } from "@/lib/serialize";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAppSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Configuration" title="Settings" description="Atur lima Gemini Canvas, rekening perusahaan, WhatsApp admin, dan harga paket dari satu tempat." icon={Settings} />
      <SettingsForm initial={serializeSettings(settings)} />
    </div>
  );
}
