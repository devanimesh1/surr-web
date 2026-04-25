# Surr — Web (`surr-web`)

Frontend for **Surr** (सुर) — a multi-language music streaming app with AI-powered discovery.

> Companion repo: [`surr-api`](https://github.com/devanimesh1/surr-api) (backend).
> Architecture: see `design/HLD.md` and `design/LLD.md` in the workspace.

## Stack

- Next.js 16 (App Router, RSC) · React 19 · TypeScript strict
- Tailwind CSS 4
- Firebase Auth (Google + Email/password)
- TanStack Query (server state) · Zustand (player + auth state)
- `next-themes` (dark default + light toggle)
- Vitest + React Testing Library
- ESLint + Prettier + Husky + lint-staged

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in Firebase + API base URL
pnpm dev                     # http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` / `pnpm test:run` | Vitest (watch / single-run) |
| `pnpm format` / `pnpm format:check` | Prettier |

## Routes

| Path | File | Notes |
|---|---|---|
| `/` | `src/app/(marketing)/page.tsx` | Landing |
| `/login` | `src/app/(auth)/login/page.tsx` | Google + email/password |
| `/home` | `src/app/(app)/home/page.tsx` | Authed home (placeholder) |

The `(app)` route group enforces auth on the client and renders the persistent
sidebar + player shell around its children.

## Environment variables

See `.env.example`. All client-exposed vars are prefixed `NEXT_PUBLIC_`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Web SDK config |
| `NEXT_PUBLIC_API_BASE_URL` | URL of the `surr-api` backend |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Optional analytics |

## Project structure

```
src/
├── app/
│   ├── (marketing)/page.tsx       # /
│   ├── (auth)/login/page.tsx      # /login
│   ├── (app)/
│   │   ├── layout.tsx             # auth-gated shell (sidebar + player)
│   │   └── home/page.tsx          # /home
│   ├── layout.tsx                 # root layout, providers, fonts
│   └── globals.css                # Surr palette tokens
├── components/
│   ├── layout/Sidebar.tsx
│   ├── player/PlayerBar.tsx       # placeholder, wired in player PR
│   └── ui/{button,theme-toggle}.tsx
├── lib/
│   ├── firebase.ts                # Web SDK init (auth only)
│   ├── api.ts                     # typed fetch wrapper
│   ├── cn.ts                      # clsx + tailwind-merge
│   ├── queryClient.ts             # TanStack Query config
│   ├── providers/AppProviders.tsx
│   ├── hooks/useAuth.ts
│   └── stores/auth.ts             # Zustand
├── types/api.ts                   # mirrored from surr-api/shared
└── test/setup.ts
```

## Theme

Surr palette — dark default, light toggle. CSS variables driven by
`data-theme="dark"|"light"` on the `<html>` element.

| Token | Light | Dark |
|---|---|---|
| `--color-primary` | `#7C3AED` | `#9B6BFF` |
| `--color-accent` | `#F0B429` | `#F0B429` |
| `--color-bg` | `#FAF7F2` | `#0F0A1A` |
| `--color-surface` | `#FFFFFF` | `#1A1228` |

## CI

`.github/workflows/ci.yml` runs format check, lint, typecheck, tests, and build
on every PR.
