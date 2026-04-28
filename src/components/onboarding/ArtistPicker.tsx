"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
}

const SUGGESTED = [
  "Diljit Dosanjh",
  "Arijit Singh",
  "AP Dhillon",
  "Anirudh Ravichander",
  "Sid Sriram",
  "Karan Aujla",
  "Pritam",
  "A. R. Rahman",
  "Bad Bunny",
  "Taylor Swift",
];

export function ArtistPicker({ value, onChange, max = 20 }: Props) {
  const [draft, setDraft] = useState("");

  function add(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (value.length >= max) return;
    if (value.some((n) => n.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...value, trimmed]);
  }

  function remove(name: string) {
    onChange(value.filter((n) => n !== name));
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
      setDraft("");
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      remove(value[value.length - 1]);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
        onClick={(e) => {
          const input = e.currentTarget.querySelector("input") as HTMLInputElement | null;
          input?.focus();
        }}
      >
        {value.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm text-[var(--color-text)]"
          >
            {name}
            <button
              type="button"
              aria-label={`Remove ${name}`}
              onClick={(e) => {
                e.stopPropagation();
                remove(name);
              }}
              className="rounded-full text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
            >
              ×
            </button>
          </span>
        ))}
        <input
          aria-label="Add an artist"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => {
            if (draft.trim()) {
              add(draft);
              setDraft("");
            }
          }}
          placeholder={value.length === 0 ? "Type an artist name and press Enter" : ""}
          className="flex-1 min-w-32 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-dim)]"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
          Suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())).map(
            (s) => (
              <Button
                key={s}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => add(s)}
                disabled={value.length >= max}
                className={cn("text-xs")}
              >
                + {s}
              </Button>
            ),
          )}
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-dim)]">
        {value.length} / {max} selected · pick at least 1, ideally 5.
      </p>
    </div>
  );
}
