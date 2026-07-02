import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");

  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  const users = mongoose.connection.collection("users");
  const indexes = await users.indexes();
  const obsolete = indexes.filter(
    (index) =>
      index.name !== "_id_" &&
      Object.keys(index.key).length === 1 &&
      index.key.id === 1
  );

  for (const index of obsolete) {
    if (index.name) {
      await users.dropIndex(index.name);
      console.log(`Removed obsolete users index: ${index.name}`);
    }
  }

  if (obsolete.length === 0) {
    console.log("No obsolete users indexes found.");
  }
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(
    "Index migration failed:",
    error instanceof Error ? error.message : "Unknown error"
  );
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
