"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { usePlayerStore } from "@/lib/stores/player";
import { Button } from "@/components/ui/button";
import type { Track } from "@/types/api";

const SAMPLE_TRACKS: Track[] = [
  {
    id: "sample-1",
    ytVideoId: "tT4HDPqnFsg",
    ytTitle: "Diljit Dosanjh - Born to Shine (Official Music Video)",
    ytChannel: "Diljit Dosanjh",
    durationSec: 213,
    title: "Born to Shine",
    primaryArtist: "Diljit Dosanjh",
    artists: ["Diljit Dosanjh"],
    language: "pa",
    artworkUrl: "https://i.ytimg.com/vi/tT4HDPqnFsg/hqdefault.jpg",
    popularity: 95,
  },
  {
    id: "sample-2",
    ytVideoId: "5xLVjCu4nf4",
    ytTitle: "Arijit Singh - Kesariya",
    ytChannel: "T-Series",
    durationSec: 268,
    title: "Kesariya",
    primaryArtist: "Arijit Singh",
    artists: ["Arijit Singh"],
    language: "hi",
    artworkUrl: "https://i.ytimg.com/vi/5xLVjCu4nf4/hqdefault.jpg",
    popularity: 92,
  },
  {
    id: "sample-3",
    ytVideoId: "joUSjuB-tLE",
    ytTitle: "Anirudh Ravichander - Vaathi Coming",
    ytChannel: "Sun TV",
    durationSec: 207,
    title: "Vaathi Coming",
    primaryArtist: "Anirudh Ravichander",
    artists: ["Anirudh Ravichander"],
    language: "ta",
    artworkUrl: "https://i.ytimg.com/vi/joUSjuB-tLE/hqdefault.jpg",
    popularity: 90,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const playQueue = usePlayerStore((s) => s.playQueue);
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}.
      </h1>
      <p className="text-[var(--color-text-dim)]">
        Try the player with a few sample tracks below. Real search and recommendations land in the
        next PRs.
      </p>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Try the player</h2>
          <Button size="sm" onClick={() => playQueue(SAMPLE_TRACKS, 0)}>
            Play all
          </Button>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_TRACKS.map((track) => (
            <li
              key={track.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div
                className="size-14 shrink-0 rounded bg-cover bg-center"
                style={{ backgroundImage: `url(${track.artworkUrl})` }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{track.title}</p>
                <p className="truncate text-xs text-[var(--color-text-dim)]">
                  {track.primaryArtist}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                aria-label={`Play ${track.title}`}
                onClick={() => playTrack(track)}
              >
                ▶
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
