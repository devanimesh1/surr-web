"use client";

import { LANGUAGES, LANGUAGE_LABELS, type Language } from "@/types/api";
import { cn } from "@/lib/cn";

interface Props {
  value: Language[];
  onChange: (next: Language[]) => void;
  max?: number;
}

export function LanguagePicker({ value, onChange, max = 10 }: Props) {
  function toggle(lang: Language) {
    const set = new Set(value);
    if (set.has(lang)) {
      set.delete(lang);
    } else if (set.size < max) {
      set.add(lang);
    }
    onChange(LANGUAGES.filter((l) => set.has(l)));
  }

  return (
    <ul
      role="listbox"
      aria-label="Languages"
      aria-multiselectable="true"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {LANGUAGES.map((lang) => {
        const selected = value.includes(lang);
        const label = LANGUAGE_LABELS[lang];
        return (
          <li key={lang}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => toggle(lang)}
              className={cn(
                "flex h-full w-full flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                selected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]",
              )}
            >
              <span className="text-base font-semibold">{label.native}</span>
              <span className="text-xs text-[var(--color-text-dim)]">{label.english}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
