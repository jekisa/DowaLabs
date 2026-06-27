import { getAppSettings } from "@/models/AppSettings";
import { serializeSettings } from "@/lib/serialize";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAppSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Atur link Canvas, link pembayaran Lynk, WhatsApp admin, dan harga
          paket. Perubahan langsung berlaku tanpa deploy ulang.
        </p>
      </div>
      <SettingsForm initial={serializeSettings(settings)} />
    </div>
  );
}
