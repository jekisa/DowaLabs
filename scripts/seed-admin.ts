import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

function loadLocalEnv() {
  for (const filename of [".env.local", ".env"]) {
    try {
      const content = readFileSync(resolve(process.cwd(), filename), "utf8");
      for (const line of content.split(/\r?\n/)) {
        const entry = line.trim();
        if (!entry || entry.startsWith("#")) continue;
        const separator = entry.indexOf("=");
        if (separator < 0) continue;
        const key = entry.slice(0, separator).trim();
        const value = entry
          .slice(separator + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        if (!(key in process.env)) process.env[key] = value;
      }
    } catch {
      // Optional env file is not present.
    }
  }
}

async function main() {
  loadLocalEnv();

  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const whatsapp = process.env.ADMIN_WHATSAPP?.trim();

  if (!uri) throw new Error("MONGODB_URI is required");
  if (!email) throw new Error("ADMIN_EMAIL is required");
  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD with at least 8 characters is required");
  }
  if (!whatsapp) throw new Error("ADMIN_WHATSAPP is required");

  await mongoose.connect(uri, { bufferCommands: false });
  const users = mongoose.connection.collection("users");
  const existing = await users.findOne({ email });

  if (existing) {
    console.log("Admin already exists: " + email);
    await mongoose.disconnect();
    return;
  }

  const now = new Date();
  await users.insertOne({
    name: "DowaLabs Admin",
    email,
    whatsapp,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    membershipStatus: "active",
    packageName: "pro",
    membershipStart: now,
    membershipEnd: new Date(now.getTime() + 3650 * 24 * 60 * 60 * 1000),
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  });

  console.log("Admin created: " + email);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(
    "Seed failed:",
    error instanceof Error ? error.message : "Unknown error"
  );
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
