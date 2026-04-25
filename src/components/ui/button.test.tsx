import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Play</Button>);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Play</Button>);
    screen.getByRole("button", { name: "Play" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("respects disabled prop", () => {
    render(<Button disabled>Play</Button>);
    expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
  });
});
