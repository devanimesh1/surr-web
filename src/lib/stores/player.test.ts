import { beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "./player";
import type { Track } from "@/types/api";

function makeTrack(id: string, durationSec = 200): Track {
  return {
    id,
    ytVideoId: `yt-${id}`,
    ytTitle: `${id} yt`,
    ytChannel: "channel",
    durationSec,
    title: `Title ${id}`,
    primaryArtist: "Artist",
    artists: ["Artist"],
    language: "en",
    artworkUrl: "https://example.test/a.jpg",
    popularity: 50,
  };
}

describe("playerStore", () => {
  beforeEach(() => {
    usePlayerStore.setState({
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
    });
  });

  describe("playQueue / playTrack", () => {
    it("starts a queue at the given index", () => {
      const q = [makeTrack("a"), makeTrack("b"), makeTrack("c")];
      usePlayerStore.getState().playQueue(q, 1);
      const s = usePlayerStore.getState();
      expect(s.queueIndex).toBe(1);
      expect(s.currentTrack?.id).toBe("b");
      expect(s.status).toBe("loading");
      expect(s.position).toBe(0);
    });

    it("clamps startIndex", () => {
      const q = [makeTrack("a"), makeTrack("b")];
      usePlayerStore.getState().playQueue(q, 99);
      expect(usePlayerStore.getState().currentTrack?.id).toBe("b");
    });

    it("playTrack wraps a single-track queue", () => {
      usePlayerStore.getState().playTrack(makeTrack("solo"));
      const s = usePlayerStore.getState();
      expect(s.queue).toHaveLength(1);
      expect(s.currentTrack?.id).toBe("solo");
    });

    it("is a no-op with an empty queue", () => {
      usePlayerStore.getState().playQueue([], 0);
      expect(usePlayerStore.getState().currentTrack).toBeNull();
    });
  });

  describe("togglePlay", () => {
    it("does nothing without a track", () => {
      usePlayerStore.getState().togglePlay();
      expect(usePlayerStore.getState().status).toBe("idle");
    });

    it("flips between playing and paused", () => {
      usePlayerStore.getState().playTrack(makeTrack("a"));
      usePlayerStore.setState({ status: "playing" });
      usePlayerStore.getState().togglePlay();
      expect(usePlayerStore.getState().status).toBe("paused");
      usePlayerStore.getState().togglePlay();
      expect(usePlayerStore.getState().status).toBe("playing");
    });

    it("resumes from ended", () => {
      usePlayerStore.getState().playTrack(makeTrack("a"));
      usePlayerStore.setState({ status: "ended" });
      usePlayerStore.getState().togglePlay();
      expect(usePlayerStore.getState().status).toBe("playing");
    });
  });

  describe("next / previous", () => {
    it("next advances within the queue", () => {
      const q = [makeTrack("a"), makeTrack("b")];
      usePlayerStore.getState().playQueue(q, 0);
      usePlayerStore.getState().next();
      expect(usePlayerStore.getState().currentTrack?.id).toBe("b");
    });

    it("next at end of queue transitions to ended", () => {
      const q = [makeTrack("a")];
      usePlayerStore.getState().playQueue(q, 0);
      usePlayerStore.getState().next();
      expect(usePlayerStore.getState().status).toBe("ended");
    });

    it("previous restarts the track when position > 3s", () => {
      const q = [makeTrack("a"), makeTrack("b")];
      usePlayerStore.getState().playQueue(q, 1);
      usePlayerStore.setState({ position: 10, duration: 100 });
      usePlayerStore.getState().previous();
      const s = usePlayerStore.getState();
      expect(s.queueIndex).toBe(1);
      expect(s.pendingSeekSec).toBe(0);
      expect(s.seekRequestId).toBe(1);
    });

    it("previous goes to the previous track when early in current", () => {
      const q = [makeTrack("a"), makeTrack("b")];
      usePlayerStore.getState().playQueue(q, 1);
      usePlayerStore.setState({ position: 1 });
      usePlayerStore.getState().previous();
      expect(usePlayerStore.getState().currentTrack?.id).toBe("a");
    });

    it("previous at index 0 seeks to 0", () => {
      const q = [makeTrack("a")];
      usePlayerStore.getState().playQueue(q, 0);
      usePlayerStore.setState({ position: 1 });
      usePlayerStore.getState().previous();
      const s = usePlayerStore.getState();
      expect(s.queueIndex).toBe(0);
      expect(s.pendingSeekSec).toBe(0);
    });
  });

  describe("seekTo", () => {
    it("clamps to [0, duration] when duration is known", () => {
      usePlayerStore.getState().playTrack(makeTrack("a", 120));
      usePlayerStore.setState({ duration: 100 });
      usePlayerStore.getState().seekTo(999);
      expect(usePlayerStore.getState().pendingSeekSec).toBe(100);
      usePlayerStore.getState().seekTo(-50);
      expect(usePlayerStore.getState().pendingSeekSec).toBe(0);
    });

    it("increments seekRequestId on each call", () => {
      const before = usePlayerStore.getState().seekRequestId;
      usePlayerStore.getState().seekTo(5);
      usePlayerStore.getState().seekTo(5);
      expect(usePlayerStore.getState().seekRequestId).toBe(before + 2);
    });
  });

  describe("volume / mute", () => {
    it("clamps volume to [0, 100]", () => {
      usePlayerStore.getState().setVolume(150);
      expect(usePlayerStore.getState().volume).toBe(100);
      usePlayerStore.getState().setVolume(-10);
      expect(usePlayerStore.getState().volume).toBe(0);
    });

    it("muting is set when volume is 0", () => {
      usePlayerStore.getState().setVolume(0);
      expect(usePlayerStore.getState().isMuted).toBe(true);
    });

    it("toggleMute flips the flag", () => {
      expect(usePlayerStore.getState().isMuted).toBe(false);
      usePlayerStore.getState().toggleMute();
      expect(usePlayerStore.getState().isMuted).toBe(true);
      usePlayerStore.getState().toggleMute();
      expect(usePlayerStore.getState().isMuted).toBe(false);
    });
  });

  describe("_onEnded", () => {
    it("auto-advances when there is a next track", () => {
      const q = [makeTrack("a"), makeTrack("b")];
      usePlayerStore.getState().playQueue(q, 0);
      usePlayerStore.getState()._onEnded();
      expect(usePlayerStore.getState().currentTrack?.id).toBe("b");
    });

    it("ends when there is no next track", () => {
      const q = [makeTrack("a")];
      usePlayerStore.getState().playQueue(q, 0);
      usePlayerStore.getState()._onEnded();
      expect(usePlayerStore.getState().status).toBe("ended");
    });
  });
});
