"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMe } from "@/lib/hooks/useMe";
import { Sidebar } from "@/components/layout/Sidebar";
import { PlayerBar } from "@/components/player/PlayerBar";
import { YouTubeMount } from "@/components/player/YouTubeMount";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useAuth();
  const meQuery = useMe();

  useEffect(() => {
    if (status === "signed-out") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (meQuery.data?.needsOnboarding) router.replace("/onboarding");
  }, [meQuery.data, router]);

  const ready = status === "signed-in" && meQuery.data?.needsOnboarding === false;

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

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-dim)]">
        Loading…
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePath={pathname} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
            <div className="text-sm text-[var(--color-text-dim)]">{user?.email ?? user?.uid}</div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => signOut(firebaseAuth())}>
                Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
      <PlayerBar />
      <YouTubeMount />
    </div>
  );
}
