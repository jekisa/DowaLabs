import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { LocalizedTitle } from "@/components/localized-title";

export const metadata: Metadata = { title: "Lupa Password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <LocalizedTitle id="Lupa Password" en="Forgot Password" />
      <ForgotPasswordForm />
    </>
  );
}
