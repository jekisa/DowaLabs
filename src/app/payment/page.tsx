import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PaymentScreen } from "@/components/PaymentScreen";
import { requireAuth } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { getAppSettings } from "@/models/AppSettings";
import { ManualPayment } from "@/models/ManualPayment";
import { serializeManualPayment } from "@/lib/manual-payment";
import { EMPTY_CANVAS_LINKS } from "@/lib/canvas-tools";

export const metadata: Metadata = { title: "Pembayaran" };
export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  const { user } = await requireAuth();
  if (!user) redirect("/login?from=/payment");

  const settings = await getAppSettings();
  const invoices = await ManualPayment.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  const bankName = settings.bankName || process.env.BANK_NAME || "";
  const bankAccountNumber =
    settings.bankAccountNumber || process.env.BANK_ACCOUNT_NUMBER || "";
  const bankAccountHolder =
    settings.bankAccountHolder || process.env.BANK_ACCOUNT_HOLDER || "";
  const canvasLinks = serializeUser(user).canAccessCanvas
    ? {
        productStudio: settings.canvasUrl || null,
        backgroundRemover: settings.backgroundRemoverUrl || null,
        colorGrading: settings.colorGradingUrl || null,
        portraitStyle: settings.portraitStyleUrl || null,
        promptAi: settings.promptAiUrl || null,
      }
    : EMPTY_CANVAS_LINKS;

  return (
    <Suspense>
      <PaymentScreen
        user={serializeUser(user)}
        settings={{
          proPrice: settings.proPrice,
          bankConfigured: Boolean(
            bankName && bankAccountNumber && bankAccountHolder
          ),
          canvasLinks,
        }}
        initialInvoices={invoices.map(serializeManualPayment)}
      />
    </Suspense>
  );
}
