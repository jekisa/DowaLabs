import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User, type IUser } from "@/models/User";
import {
  isExpired,
  type MembershipStatus,
} from "@/lib/membership";

export interface AuthResult {
  user: IUser | null;
  error?: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND";
}

/**
 * Load the authenticated user from the DB based on the session cookie.
 * Also lazily flips an `active` membership to `expired` once the end
 * date has passed (PRD §15 recommended behavior).
 */
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

export async function requireUser(): Promise<AuthResult> {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "UNAUTHENTICATED" };
  return { user };
}

export async function requireAdmin(): Promise<AuthResult> {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "UNAUTHENTICATED" };
  if (user.role !== "admin") return { user: null, error: "FORBIDDEN" };
  return { user };
}
