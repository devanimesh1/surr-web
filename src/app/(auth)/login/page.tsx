"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
      router.push("/home");
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmail(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const action =
        mode === "signin" ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      await action(firebaseAuth(), email, password);
      router.push("/home");
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          सुर · Surr
        </Link>
        <ThemeToggle />
      </header>
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-[var(--color-text-dim)]">
              {mode === "signin" ? "Sign in to continue to Surr" : "Sign up to start listening"}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-dim)]">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            or
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <form className="space-y-3" onSubmit={handleEmail}>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-[var(--color-text-dim)]">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-[var(--color-text-dim)]">Password</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-dim)]">
            {mode === "signin" ? "New to Surr?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

function extractMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
