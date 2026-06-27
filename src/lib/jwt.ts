import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Edge-compatible JWT helpers (used by both middleware and route handlers).
 * Uses `jose` so it runs in the Next.js Edge runtime where Node's `crypto`
 * / bcrypt are unavailable.
 */

export const SESSION_COOKIE = "dowalabs_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export type SessionRole = "user" | "admin";

export interface SessionPayload extends JWTPayload {
  sub: string; // user id
  email: string;
  role: SessionRole;
  name: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(
  payload: Omit<SessionPayload, keyof JWTPayload>
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "user" || payload.role === "admin")
    ) {
      return payload as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}
