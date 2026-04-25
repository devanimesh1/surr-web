"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}.
      </h1>
      <p className="text-[var(--color-text-dim)]">
        Surr scaffolding is live. Music discovery, search, playlists, and AI features ship in
        upcoming PRs.
      </p>
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-lg font-semibold">What&apos;s next</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-dim)]">
          <li>Onboarding quiz (languages + favorite artists)</li>
          <li>Persistent YouTube-backed player</li>
          <li>Semantic search and AI playlist generation</li>
          <li>Library, playlists, social feed</li>
        </ul>
      </section>
    </div>
  );
}
