import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LocalizedTitle } from "@/components/localized-title";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Suspense>
      <LocalizedTitle id="Login" en="Log In" />
      <LoginForm />
    </Suspense>
  );
}
