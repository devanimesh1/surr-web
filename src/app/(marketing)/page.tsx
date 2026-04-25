import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <span className="text-xl font-bold tracking-tight">सुर · Surr</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
        </div>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          Discover music in your language. Powered by AI.
        </h1>
        <p className="max-w-xl text-balance text-lg text-[var(--color-text-dim)]">
          Surr is a multi-language streaming app for Punjabi, Hindi, Tamil, Telugu, Malayalam,
          Marathi, Bengali, Haryanvi, English, and Spanish — with mood-based search and AI-generated
          playlists.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg">Get started</Button>
          </Link>
          <a
            href="https://github.com/devanimesh1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
          >
            View source
          </a>
        </div>
      </section>
      <footer className="border-t border-[var(--color-border)] px-6 py-4 text-center text-xs text-[var(--color-text-dim)]">
        Built on free tier · Firebase + Vertex/Hugging Face + Supabase pgvector
      </footer>
    </main>
  );
}
