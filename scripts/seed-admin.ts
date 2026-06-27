/**
 * Seed / ensure the default admin account.
 *
 * Self-contained (no path aliases) so it runs cleanly under tsx.
 *
 * Usage:
 *   1. Make sure .env.local has MONGODB_URI, ADMIN_EMAIL, ADMIN_DEFAULT_PASSWORD
 *   2. npm run seed:admin
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Minimal .env(.local) loader so we don't need an extra dependency.
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();
        value = value.replace(/^["']|["']$/g, "");
        if (!(key in process.env)) process.env[key] = value;
      }
    } catch {
      /* file not found — ignore */
    }
  }
}

async function main() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!uri) throw new Error("MONGODB_URI is required");
  if (!email || !password)
    throw new Error("ADMIN_EMAIL and ADMIN_DEFAULT_PASSWORD are required");

  await mongoose.connect(uri);
  const Users = mongoose.connection.collection("users");

  const existing = await Users.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();

  if (existing) {
    await Users.updateOne(
      { email },
      {
        $set: {
          role: "admin",
          membershipStatus: "active",
          passwordHash,
          updatedAt: now,
        },
      }
    );
    console.log(`✓ Admin updated: ${email}`);
  } else {
    await Users.insertOne({
      name: "DowaLabs Admin",
      email,
      whatsapp: process.env.DEFAULT_ADMIN_WHATSAPP || "0000000000",
      passwordHash,
      role: "admin",
      membershipStatus: "active",
      packageName: "pro",
      membershipStart: now,
      membershipEnd: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3650),
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✓ Admin created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
