import jwt, { type JwtPayload } from "jsonwebtoken";

export const SESSION_COOKIE = "dowalabs_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionRole = "user" | "admin";

export interface SessionPayload extends JwtPayload {
  sub: string;
  email: string;
  role: SessionRole;
  name: string;
}

export interface TokenUser {
  _id?: { toString(): string };
  id?: string;
  email: string;
  role: SessionRole;
  name: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined.");
  }
  return secret;
}

export function createToken(user: TokenUser): string {
  const subject = user.id ?? user._id?.toString();
  if (!subject) throw new Error("User id is required to create a token.");

  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
    },
    getJwtSecret(),
    {
      algorithm: "HS256",
      subject,
      expiresIn: SESSION_MAX_AGE,
    }
  );
}

export function verifyToken(token: string | null | undefined): SessionPayload | null {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload !== "string" &&
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      (payload.role === "user" || payload.role === "admin")
    ) {
      return payload as SessionPayload;
    }
  } catch {
    return null;
  }

  return null;
}
