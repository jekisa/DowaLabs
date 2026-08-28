import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { LocalizedTitle } from "@/components/localized-title";

export const metadata: Metadata = { title: "Daftar" };

export default function SignupPage() {
  return (
    <Suspense>
      <LocalizedTitle id="Daftar" en="Sign Up" />
      <SignupForm />
    </Suspense>
  );
}
