import { getAppSettings } from "@/models/AppSettings";
import { getCurrentUser } from "@/lib/auth";
import { canAccessCanvas, type MembershipStatus } from "@/lib/membership";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await getAppSettings();
    const user = await getCurrentUser();
    const canAccess =
      !!user &&
      canAccessCanvas(
        user.membershipStatus as MembershipStatus,
        user.membershipEnd
      );

    return ok({
      canvasUrl: canAccess ? settings.canvasUrl : null,
      backgroundRemoverUrl: canAccess
        ? settings.backgroundRemoverUrl || null
        : null,
      colorGradingUrl: canAccess ? settings.colorGradingUrl || null : null,
      portraitStyleUrl: canAccess ? settings.portraitStyleUrl || null : null,
      promptAiUrl: canAccess ? settings.promptAiUrl || null : null,
      adminWhatsapp: settings.adminWhatsapp,
      proPrice: settings.proPrice,
    });
  } catch (error) {
    console.error("[settings] error:", error);
    return fail("Gagal memuat pengaturan", 500);
  }
}
