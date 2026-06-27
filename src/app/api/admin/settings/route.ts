import { NextRequest } from "next/server";
import { AppSettings, getAppSettings } from "@/models/AppSettings";
import { requireAdmin } from "@/lib/server-auth";
import { ok, fail, zodErrors } from "@/lib/api";
import { adminSettingsSchema } from "@/lib/validators";
import { serializeSettings } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  try {
    const settings = await getAppSettings();
    return ok({ settings: serializeSettings(settings) });
  } catch (e) {
    console.error("[admin/settings GET] error:", e);
    return fail("Gagal memuat pengaturan", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error === "UNAUTHENTICATED") return fail("Belum login", 401);
  if (error === "FORBIDDEN") return fail("Akses ditolak", 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Body harus berupa JSON", 400);
  }

  const parsed = adminSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Data tidak valid", 422, zodErrors(parsed.error));
  }

  try {
    // Ensure the singleton exists, then apply only provided fields.
    await getAppSettings();
    const updated = await AppSettings.findOneAndUpdate(
      { key: "global" },
      { $set: parsed.data },
      { new: true, upsert: true }
    );
    return ok({ settings: serializeSettings(updated!) });
  } catch (e) {
    console.error("[admin/settings PATCH] error:", e);
    return fail("Gagal menyimpan pengaturan", 500);
  }
}
