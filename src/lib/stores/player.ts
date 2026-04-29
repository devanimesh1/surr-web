import { create } from "zustand";
import type { Track } from "@/types/api";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

export interface PlayerState {
  queue: Track[];
  queueIndex: number;
  currentTrack: Track | null;
  status: PlayerStatus;
  /** YouTube's reported position in seconds. Updated via polling while playing. */
  position: number;
  /** YouTube's reported duration in seconds (0 until the player loads metadata). */
  duration: number;
  /** Volume in 0..100. Persisted across sessions in PR-Phase4c+. */
  volume: number;
  isMuted: boolean;
  /**
   * Monotonically increasing counter — controller hooks watch this to know when
   * the user has explicitly requested a seek (vs. organic playback advancement).
   */
  seekRequestId: number;
  /** Target position in seconds for the most recent seek request. */
  pendingSeekSec: number;
}

export interface PlayerActions {
  /** Replace the queue and start at `startIndex`. Sets status to "loading". */
  playQueue: (queue: Track[], startIndex?: number) => void;
  /** Convenience: queue of one. */
  playTrack: (track: Track) => void;
  /** Toggle between playing and paused. No-op when no track is loaded. */
  togglePlay: () => void;
  /** Advance to the next track in the queue, or no-op at the end. */
  next: () => void;
  /** Go to the previous track. If past 3 s into the current track, restarts it instead. */
  previous: () => void;
  /** Request the iframe to seek to `sec`. */
  seekTo: (sec: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  /* --- internal state setters, used by the controller hook --- */
  _setStatus: (status: PlayerStatus) => void;
  _setPosition: (position: number) => void;
  _setDuration: (duration: number) => void;
  _onEnded: () => void;
}

export type PlayerStore = PlayerState & PlayerActions;

const initialState: PlayerState = {
  queue: [],
  queueIndex: 0,
  currentTrack: null,
  status: "idle",
  position: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  seekRequestId: 0,
  pendingSeekSec: 0,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  playQueue: (queue, startIndex = 0) => {
    if (queue.length === 0) return;
    const safeIndex = Math.min(Math.max(startIndex, 0), queue.length - 1);
    set({
      queue,
      queueIndex: safeIndex,
      currentTrack: queue[safeIndex],
      status: "loading",
      position: 0,
      duration: 0,
    });
  },

  playTrack: (track) => {
    get().playQueue([track], 0);
  },

  togglePlay: () => {
    const { currentTrack, status } = get();
    if (!currentTrack) return;
    if (status === "playing") {
      set({ status: "paused" });
    } else if (status === "paused" || status === "ended") {
      set({ status: "playing" });
    }
  },

  next: () => {
    const { queue, queueIndex } = get();
    if (queueIndex >= queue.length - 1) {
      set({ status: "ended" });
      return;
    }
    const nextIndex = queueIndex + 1;
    set({
      queueIndex: nextIndex,
      currentTrack: queue[nextIndex],
      status: "loading",
      position: 0,
      duration: 0,
    });
  },

  previous: () => {
    const { queue, queueIndex, position } = get();
    if (position > 3) {
      get().seekTo(0);
      return;
    }
    if (queueIndex <= 0) {
      get().seekTo(0);
      return;
    }
    const prevIndex = queueIndex - 1;
    set({
      queueIndex: prevIndex,
      currentTrack: queue[prevIndex],
      status: "loading",
      position: 0,
      duration: 0,
    });
  },

  seekTo: (sec) => {
    const { duration } = get();
    const target = duration > 0 ? Math.min(Math.max(sec, 0), duration) : Math.max(sec, 0);
    set((s) => ({
      pendingSeekSec: target,
      seekRequestId: s.seekRequestId + 1,
      position: target,
    }));
  },

  setVolume: (volume) => {
    const v = Math.min(Math.max(volume, 0), 100);
    set({ volume: v, isMuted: v === 0 ? true : false });
  },

  toggleMute: () => {
    set((s) => ({ isMuted: !s.isMuted }));
  },

  _setStatus: (status) => set({ status }),
  _setPosition: (position) => set({ position }),
  _setDuration: (duration) => set({ duration }),
  _onEnded: () => {
    const { queue, queueIndex } = get();
    if (queueIndex < queue.length - 1) {
      get().next();
    } else {
      set({ status: "ended", position: 0 });
    }
  },
}));
