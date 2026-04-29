"use client";

import { useEffect, useRef } from "react";
import YouTube, { type YouTubePlayer } from "react-youtube";
import { usePlayerStore } from "@/lib/stores/player";

const PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

const POLL_INTERVAL_MS = 500;

/**
 * Hidden YouTube IFrame mount. The visible controls live in `PlayerBar`; this
 * component owns the actual `<YouTube />` instance and bridges its imperative
 * API to our Zustand store.
 */
export function YouTubeMount() {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const status = usePlayerStore((s) => s.status);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const seekRequestId = usePlayerStore((s) => s.seekRequestId);
  const pendingSeekSec = usePlayerStore((s) => s.pendingSeekSec);

  // Imperative play/pause sync.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (status === "playing") {
      void player.playVideo();
    } else if (status === "paused") {
      void player.pauseVideo();
    }
  }, [status]);

  // Volume + mute sync.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    void player.setVolume(volume);
    if (isMuted) {
      void player.mute();
    } else {
      void player.unMute();
    }
  }, [volume, isMuted]);

  // Seek sync — re-runs on every new seek request, even to the same seconds.
  useEffect(() => {
    if (seekRequestId === 0) return;
    const player = playerRef.current;
    if (!player) return;
    void player.seekTo(pendingSeekSec, true);
  }, [seekRequestId, pendingSeekSec]);

  // Position polling — only while playing.
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(async () => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const [pos, dur] = await Promise.all([player.getCurrentTime(), player.getDuration()]);
        if (typeof pos === "number") usePlayerStore.getState()._setPosition(pos);
        if (typeof dur === "number" && dur > 0) usePlayerStore.getState()._setDuration(dur);
      } catch {
        // YouTube SDK calls can reject during state transitions; ignore.
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [status]);

  if (!currentTrack) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0 size-px opacity-0">
      <YouTube
        videoId={currentTrack.ytVideoId}
        opts={{
          height: "1",
          width: "1",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
        }}
        onReady={(e) => {
          playerRef.current = e.target;
          void e.target.setVolume(usePlayerStore.getState().volume);
          if (usePlayerStore.getState().isMuted) {
            void e.target.mute();
          }
        }}
        onPlay={() => usePlayerStore.getState()._setStatus("playing")}
        onPause={() => usePlayerStore.getState()._setStatus("paused")}
        onEnd={() => usePlayerStore.getState()._onEnded()}
        onError={() => usePlayerStore.getState()._setStatus("error")}
        onStateChange={(e) => {
          if (e.data === PLAYER_STATE.BUFFERING) {
            // Don't downgrade to "loading" once we've been playing — just no-op.
          }
        }}
      />
    </div>
  );
}
