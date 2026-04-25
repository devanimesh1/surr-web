import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/lib/providers/AppProviders";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Surr — discover music in your language",
    template: "%s · Surr",
  },
  description:
    "Surr (सुर) — multi-language music discovery powered by AI. Search by mood, generate playlists from a prompt, listen in 10+ languages.",
  applicationName: "Surr",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
