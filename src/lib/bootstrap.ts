import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

/**
 * Ensure a default admin account exists (PRD §12 — created on first run).
 * Safe to call repeatedly; it only inserts when the admin email is missing.
 */
export async function ensureDefaultAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!email || !password) return;

  await connectToDatabase();
  const existing = await User.findOne({ email });
  if (existing) return;

  await User.create({
    name: "DowaLabs Admin",
    email,
    whatsapp: process.env.DEFAULT_ADMIN_WHATSAPP || "0000000000",
    passwordHash: await hashPassword(password),
    role: "admin",
    membershipStatus: "active",
    packageName: "pro",
    membershipStart: new Date(),
    membershipEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3650),
  });
}
