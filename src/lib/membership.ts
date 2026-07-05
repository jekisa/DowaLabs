export type MembershipStatus = "pending" | "active" | "expired" | "blocked";
export type PackageName = "basic" | "pro";

export const MEMBERSHIP_DAYS = 30;
export const PRO_PRICE = 29_900;

/** Normalize common provider statuses that mean a payment has settled. */
export function isSuccessStatus(status: string): boolean {
  return ["paid", "success", "successful", "settled", "completed", "complete"].includes(
    status.trim().toLowerCase()
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Compute the new membership end date when a payment succeeds.
 * - If the user is still active (end date in the future), extend from that date.
 * - Otherwise start a fresh period from now.
 */
export function computeMembershipEnd(
  currentEnd: Date | null | undefined,
  now: Date = new Date(),
  days: number = MEMBERSHIP_DAYS
): Date {
  if (currentEnd && currentEnd.getTime() > now.getTime()) {
    return addDays(currentEnd, days);
  }
  return addDays(now, days);
}

/** True when an active membership's end date has already passed. */
export function isExpired(
  status: MembershipStatus,
  membershipEnd: Date | null | undefined,
  now: Date = new Date()
): boolean {
  if (status !== "active") return false;
  if (!membershipEnd) return true;
  return membershipEnd.getTime() < now.getTime();
}

/** Days remaining until expiry (0 if already expired / not active). */
export function remainingDays(
  membershipEnd: Date | null | undefined,
  now: Date = new Date()
): number {
  if (!membershipEnd) return 0;
  const diff = membershipEnd.getTime() - now.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Only active members may open the Canvas. */
export function canAccessCanvas(
  status: MembershipStatus,
  membershipEnd: Date | null | undefined,
  now: Date = new Date()
): boolean {
  return Boolean(
    status === "active" &&
    membershipEnd &&
    !isExpired(status, membershipEnd, now)
  );
}

export const STATUS_LABELS: Record<MembershipStatus, string> = {
  pending: "Menunggu Pembayaran",
  active: "Aktif",
  expired: "Kedaluwarsa",
  blocked: "Diblokir",
};
