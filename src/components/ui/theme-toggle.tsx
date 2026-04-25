"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHasMounted();
  if (!mounted) return null;

  const current = theme === "system" ? resolvedTheme : theme;
  const next = current === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
    >
      {current === "dark" ? "☼ Light" : "☾ Dark"}
    </Button>
  );
}
