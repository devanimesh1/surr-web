import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArtistPicker } from "./ArtistPicker";

function getInput(): HTMLInputElement {
  return screen.getByLabelText("Add an artist") as HTMLInputElement;
}

describe("ArtistPicker", () => {
  it("adds an artist on Enter", () => {
    const onChange = vi.fn();
    render(<ArtistPicker value={[]} onChange={onChange} />);
    const input = getInput();
    fireEvent.change(input, { target: { value: "Diljit Dosanjh" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["Diljit Dosanjh"]);
  });

  it("dedupes case-insensitively", () => {
    const onChange = vi.fn();
    render(<ArtistPicker value={["Diljit Dosanjh"]} onChange={onChange} />);
    const input = getInput();
    fireEvent.change(input, { target: { value: "diljit dosanjh" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes via the chip's remove button", () => {
    const onChange = vi.fn();
    render(<ArtistPicker value={["Arijit Singh", "AP Dhillon"]} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Remove Arijit Singh"));
    expect(onChange).toHaveBeenCalledWith(["AP Dhillon"]);
  });

  it("removes the last chip on Backspace when input is empty", () => {
    const onChange = vi.fn();
    render(<ArtistPicker value={["Arijit Singh"]} onChange={onChange} />);
    fireEvent.keyDown(getInput(), { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("adds via a suggestion button", () => {
    const onChange = vi.fn();
    render(<ArtistPicker value={[]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Diljit Dosanjh/ }));
    expect(onChange).toHaveBeenCalledWith(["Diljit Dosanjh"]);
  });

  it("does not exceed max", () => {
    const onChange = vi.fn();
    render(<ArtistPicker value={["A"]} onChange={onChange} max={1} />);
    const input = getInput();
    fireEvent.change(input, { target: { value: "B" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });
});
