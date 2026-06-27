import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentScreen } from "@/components/PaymentScreen";

export const metadata: Metadata = { title: "Pembayaran" };

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentScreen />
    </Suspense>
  );
}
