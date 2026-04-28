import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguagePicker } from "./LanguagePicker";
import { LANGUAGES } from "@/types/api";

describe("LanguagePicker", () => {
  it("renders one option per supported language", () => {
    render(<LanguagePicker value={[]} onChange={() => {}} />);
    expect(screen.getAllByRole("option")).toHaveLength(LANGUAGES.length);
  });

  it("marks the selected languages as aria-selected", () => {
    render(<LanguagePicker value={["pa", "hi"]} onChange={() => {}} />);
    const punjabi = screen.getByRole("option", { name: /Punjabi/i });
    const tamil = screen.getByRole("option", { name: /Tamil/i });
    expect(punjabi).toHaveAttribute("aria-selected", "true");
    expect(tamil).toHaveAttribute("aria-selected", "false");
  });

  it("toggles a language on click", () => {
    const onChange = vi.fn();
    render(<LanguagePicker value={["pa"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("option", { name: /Hindi/i }));
    expect(onChange).toHaveBeenCalledWith(["pa", "hi"]);
  });

  it("removes a language when clicking a selected one", () => {
    const onChange = vi.fn();
    render(<LanguagePicker value={["pa", "hi"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("option", { name: /Hindi/i }));
    expect(onChange).toHaveBeenCalledWith(["pa"]);
  });

  it("ignores additions past the max", () => {
    const onChange = vi.fn();
    render(<LanguagePicker value={["pa"]} onChange={onChange} max={1} />);
    fireEvent.click(screen.getByRole("option", { name: /Hindi/i }));
    // The component still emits onChange but with the unchanged value.
    expect(onChange).toHaveBeenCalledWith(["pa"]);
  });
});
