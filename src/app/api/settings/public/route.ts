import { getAppSettings } from "@/models/AppSettings";
import { getCurrentUser } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";
import { canAccessCanvas, type MembershipStatus } from "@/lib/membership";

export const runtime = "nodejs";

/**
 * Public-ish settings. Prices and admin WhatsApp are returned to
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
      adminWhatsapp: settings.adminWhatsapp,
      proPrice: settings.proPrice,
      canvasUrl: canvasUnlocked ? settings.canvasUrl : null,
      backgroundRemoverUrl: canvasUnlocked
        ? settings.backgroundRemoverUrl || null
        : null,
      colorGradingUrl: canvasUnlocked ? settings.colorGradingUrl || null : null,
      portraitStyleUrl: canvasUnlocked
        ? settings.portraitStyleUrl || null
        : null,
      promptAiUrl: canvasUnlocked ? settings.promptAiUrl || null : null,
    });
  } catch (error) {
    console.error("[settings/public] error:", error);
    return fail("Gagal memuat pengaturan", 500);
  }
}
