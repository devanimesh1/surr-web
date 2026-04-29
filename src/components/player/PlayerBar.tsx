"use client";

import Image from "next/image";
import { usePlayerStore } from "@/lib/stores/player";
import { cn } from "@/lib/cn";

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const total = Math.floor(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const status = usePlayerStore((s) => s.status);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  const isPlaying = status === "playing";
  const hasTrack = currentTrack !== null;
  const hasNext = queueIndex < queue.length - 1;
  const effectiveDuration = duration > 0 ? duration : (currentTrack?.durationSec ?? 0);

  return (
    <footer
      role="region"
      aria-label="Player"
      className="flex h-20 shrink-0 items-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4"
    >
      {/* Left: track meta */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded bg-[var(--color-bg)]">
          {currentTrack?.artworkUrl && (
            <Image
              src={currentTrack.artworkUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{currentTrack?.title ?? "Nothing playing"}</p>
          <p className="truncate text-xs text-[var(--color-text-dim)]">
            {currentTrack?.primaryArtist ?? "Pick a track to start listening"}
          </p>
        </div>
      </div>

      {/* Middle: transport */}
      <div className="hidden flex-1 flex-col items-center gap-1 sm:flex">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            onClick={previous}
            disabled={!hasTrack}
            className={cn(
              "grid size-9 place-items-center rounded-full text-[var(--color-text-dim)]",
              "transition-colors hover:text-[var(--color-text)] disabled:opacity-30",
            )}
          >
            ⏮
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            aria-pressed={isPlaying}
            onClick={togglePlay}
            disabled={!hasTrack}
            className={cn(
              "grid size-10 place-items-center rounded-full bg-[var(--color-primary)] text-white",
              "transition-opacity hover:opacity-90 disabled:opacity-50",
            )}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            disabled={!hasTrack || !hasNext}
            className={cn(
              "grid size-9 place-items-center rounded-full text-[var(--color-text-dim)]",
              "transition-colors hover:text-[var(--color-text)] disabled:opacity-30",
            )}
          >
            ⏭
          </button>
        </div>
        <div className="flex w-full max-w-md items-center gap-2 text-xs text-[var(--color-text-dim)]">
          <span className="tabular-nums">{formatTime(position)}</span>
          <input
            aria-label="Seek"
            type="range"
            min={0}
            max={Math.max(effectiveDuration, 1)}
            step={1}
            value={Math.min(position, effectiveDuration || position)}
            onChange={(e) => seekTo(Number(e.target.value))}
            disabled={!hasTrack || effectiveDuration === 0}
            className="w-full accent-[var(--color-primary)]"
          />
          <span className="tabular-nums">{formatTime(effectiveDuration)}</span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="hidden flex-1 items-center justify-end gap-2 sm:flex">
        <button
          type="button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={toggleMute}
          className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
        >
          {isMuted || volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
        </button>
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={100}
          step={1}
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 accent-[var(--color-primary)]"
        />
      </div>
    </footer>
  );
}
