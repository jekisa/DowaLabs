import { getAppSettings } from "@/models/AppSettings";
import { getCurrentUser } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";
import { canAccessCanvas, type MembershipStatus } from "@/lib/membership";

export const runtime = "nodejs";

/**
 * Public-ish settings. Lynk URLs, admin WhatsApp and prices are returned to
 * anyone, but the Canvas URL is only revealed to an authenticated *active*
 * member (PRD §14.2 / §19).
 */
export async function GET() {
  try {
    const settings = await getAppSettings();
    const user = await getCurrentUser();

    const canvasUnlocked =
      !!user &&
      canAccessCanvas(
        user.membershipStatus as MembershipStatus,
        user.membershipEnd
      );

    return ok({
      lynkBasicUrl: settings.lynkBasicUrl,
      lynkProUrl: settings.lynkProUrl,
      adminWhatsapp: settings.adminWhatsapp,
      basicPrice: settings.basicPrice,
      proPrice: settings.proPrice,
      canvasUrl: canvasUnlocked ? settings.canvasUrl : null,
    });
  } catch (error) {
    console.error("[settings/public] error:", error);
    return fail("Gagal memuat pengaturan", 500);
  }
}
