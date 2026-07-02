import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { isExpired, type MembershipStatus } from "@/lib/membership";
import {
  createToken,
  verifyToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
  type TokenUser,
} from "@/lib/jwt";
import { User, type IUser } from "@/models/User";

export { createToken, verifyToken };

export interface AuthResult {
  user: IUser | null;
  error?: "UNAUTHENTICATED" | "FORBIDDEN";
}

export async function setSessionCookie(user: TokenUser): Promise<void> {
  const token = createToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export const createSessionCookie = setSessionCookie;

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser(): Promise<IUser | null> {
  const session = await getSession();
  if (!session?.sub) return null;

  await connectToDatabase();
  const user = await User.findById(session.sub);
  if (!user) return null;

  if (isExpired(user.membershipStatus as MembershipStatus, user.membershipEnd)) {
    user.membershipStatus = "expired";
    await user.save();
  }

  return user;
}

export async function requireAuth(): Promise<AuthResult> {
  const user = await getCurrentUser();
  return user ? { user } : { user: null, error: "UNAUTHENTICATED" };
}

export const requireUser = requireAuth;

export async function requireAdmin(): Promise<AuthResult> {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "UNAUTHENTICATED" };
  if (user.role !== "admin") return { user: null, error: "FORBIDDEN" };
  return { user };
}
