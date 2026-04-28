"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMe } from "@/lib/hooks/useMe";
import { Button } from "@/components/ui/button";
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

  if (status === "signed-in" && meQuery.isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold text-[var(--color-text)]">
          Couldn&apos;t load your profile
        </h1>
        <p className="max-w-md text-sm text-[var(--color-text-dim)]">
          {meQuery.error?.message ?? "Something went wrong while talking to the API."}
        </p>
        <div className="flex gap-2">
          <Button onClick={() => meQuery.refetch()}>Retry</Button>
          <Button variant="ghost" onClick={() => signOut(firebaseAuth())}>
            Sign out
          </Button>
        </div>
      </main>
    );
  }

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
