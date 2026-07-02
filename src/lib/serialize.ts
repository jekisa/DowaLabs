import type { IUser } from "@/models/User";
import type { IAppSettings } from "@/models/AppSettings";
import {
  canAccessCanvas,
  remainingDays,
  type MembershipStatus,
} from "@/lib/membership";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  role: "user" | "admin";
  membershipStatus: MembershipStatus;
  packageName: "basic" | "pro";
  membershipStart: string | null;
  membershipEnd: string | null;
  lastLoginAt: string | null;
  remainingDays: number;
  canAccessCanvas: boolean;
  createdAt: string;
}

export function serializeUser(user: IUser): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    whatsapp: user.whatsapp,
    role: user.role,
    membershipStatus: user.membershipStatus as MembershipStatus,
    // Legacy Basic records are presented as Pro now that Pro is the only plan.
    packageName: "pro",
    membershipStart: user.membershipStart?.toISOString() ?? null,
    membershipEnd: user.membershipEnd?.toISOString() ?? null,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    remainingDays: remainingDays(user.membershipEnd),
    canAccessCanvas: canAccessCanvas(
      user.membershipStatus as MembershipStatus,
      user.membershipEnd
    ),
    createdAt: user.createdAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

export function serializeSettings(settings: IAppSettings) {
  return {
    canvasUrl: settings.canvasUrl,
    backgroundRemoverUrl: settings.backgroundRemoverUrl || "",
    colorGradingUrl: settings.colorGradingUrl || "",
    portraitStyleUrl: settings.portraitStyleUrl || "",
    promptAiUrl: settings.promptAiUrl || "",
    adminWhatsapp: settings.adminWhatsapp,
    proPrice: settings.proPrice,
    bankName: settings.bankName || process.env.BANK_NAME || "",
    bankAccountNumber:
      settings.bankAccountNumber || process.env.BANK_ACCOUNT_NUMBER || "",
    bankAccountHolder:
      settings.bankAccountHolder || process.env.BANK_ACCOUNT_HOLDER || "",
    updatedAt: settings.updatedAt?.toISOString() ?? null,
  };
}
