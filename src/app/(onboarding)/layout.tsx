"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMe } from "@/lib/hooks/useMe";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();
  const meQuery = useMe();

  useEffect(() => {
    if (status === "signed-out") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (meQuery.data && meQuery.data.needsOnboarding === false) {
      router.replace("/home");
    }
  }, [meQuery.data, router]);

  const showLoading =
    status !== "signed-in" || meQuery.isLoading || meQuery.data?.needsOnboarding === false;

  if (showLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-dim)]">
        Loading…
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <span className="text-xl font-bold tracking-tight">सर · Surr</span>
        <ThemeToggle />
      </header>
      <main className="flex-1 px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
