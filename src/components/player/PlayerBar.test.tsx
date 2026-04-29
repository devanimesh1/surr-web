import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerBar } from "./PlayerBar";
import { usePlayerStore } from "@/lib/stores/player";
import type { Track } from "@/types/api";

function track(): Track {
  return {
    id: "t1",
    ytVideoId: "vid1",
    ytTitle: "yt",
    ytChannel: "ch",
    durationSec: 180,
    title: "Born to Shine",
    primaryArtist: "Diljit Dosanjh",
    artists: ["Diljit Dosanjh"],
    language: "pa",
    artworkUrl: "https://example.test/a.jpg",
    popularity: 90,
  };
}

describe("PlayerBar", () => {
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

  it("renders the empty state with play disabled", () => {
    render(<PlayerBar />);
    expect(screen.getByText(/Nothing playing/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Play/i })).toBeDisabled();
  });

  it("shows the current track's metadata", () => {
    usePlayerStore.getState().playTrack(track());
    render(<PlayerBar />);
    expect(screen.getByText("Born to Shine")).toBeInTheDocument();
    expect(screen.getByText("Diljit Dosanjh")).toBeInTheDocument();
  });

  it("toggles play via the transport button", () => {
    usePlayerStore.getState().playTrack(track());
    usePlayerStore.setState({ status: "paused" });
    render(<PlayerBar />);
    fireEvent.click(screen.getByRole("button", { name: /Play/i }));
    expect(usePlayerStore.getState().status).toBe("playing");
  });

  it("disables Next when there is no next track", () => {
    usePlayerStore.getState().playTrack(track());
    render(<PlayerBar />);
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });
});
