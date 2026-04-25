"use client";

/**
 * Persistent player bar shell. Empty state in the bootstrap PR — wired up to
 * the Zustand player store + YouTube IFrame player in the player module PR.
 */
export function PlayerBar() {
  return (
    <footer
      role="region"
      aria-label="Player"
      className="flex h-20 shrink-0 items-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="size-12 shrink-0 rounded bg-[var(--color-bg)]" aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Nothing playing</p>
          <p className="truncate text-xs text-[var(--color-text-dim)]">
            Pick a track to start listening
          </p>
        </div>
      </div>
      <div className="hidden flex-1 items-center justify-center gap-3 sm:flex">
        <button
          type="button"
          aria-label="Play"
          className="grid size-10 place-items-center rounded-full bg-[var(--color-primary)] text-white opacity-50"
          disabled
        >
          ▶
        </button>
      </div>
      <div className="hidden flex-1 sm:block" />
    </footer>
  );
}
