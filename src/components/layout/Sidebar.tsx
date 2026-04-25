import Link from "next/link";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
}

const items: NavItem[] = [
  { href: "/home", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/library", label: "Your Library" },
];

export function Sidebar({ activePath }: { activePath?: string }) {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col gap-1 border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:flex">
      <Link href="/home" className="mb-4 px-2 text-2xl font-bold tracking-tight">
        सुर<span className="text-[var(--color-text-dim)]"> · Surr</span>
      </Link>
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {items.map((item) => {
          const active = activePath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-bg)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-dim)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
