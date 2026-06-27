import type { IUser } from "@/models/User";
import type { IPaymentLog } from "@/models/PaymentLog";
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
  packageName: "basic" | "pro" | null;
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
    packageName: user.packageName,
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

export function serializePaymentLog(log: IPaymentLog) {
  return {
    id: log._id.toString(),
    provider: log.provider,
    userId: log.userId ? log.userId.toString() : null,
    orderId: log.orderId,
    transactionId: log.transactionId,
    email: log.email,
    whatsapp: log.whatsapp,
    amount: log.amount,
    currency: log.currency,
    packageName: log.packageName,
    status: log.status,
    processed: log.processed,
    processingError: log.processingError,
    rawPayload: log.rawPayload,
    createdAt: log.createdAt?.toISOString() ?? null,
  };
}

export function serializeSettings(settings: IAppSettings) {
  return {
    canvasUrl: settings.canvasUrl,
    lynkBasicUrl: settings.lynkBasicUrl,
    lynkProUrl: settings.lynkProUrl,
    adminWhatsapp: settings.adminWhatsapp,
    basicPrice: settings.basicPrice,
    proPrice: settings.proPrice,
    updatedAt: settings.updatedAt?.toISOString() ?? null,
  };
}
