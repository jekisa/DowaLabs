import { requireUser } from "@/lib/server-auth";
import { ok, fail } from "@/lib/api";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET() {
  const { user, error } = await requireUser();
  if (error || !user) return fail("Belum login", 401);
  return ok({ user: serializeUser(user) });
}
