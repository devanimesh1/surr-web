/**
 * Shared API/domain types — manually mirrored from `surr-api/shared/src/types/`.
 * Keep in sync when updating the backend.
 */

export const LANGUAGES = [
  "pa",
  "hi",
  "ta",
  "te",
  "ml",
  "mr",
  "bn",
  "haryanvi",
  "en",
  "es",
] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, { native: string; english: string }> = {
  pa: { native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  hi: { native: "हिन्दी", english: "Hindi" },
  ta: { native: "தமிழ்", english: "Tamil" },
  te: { native: "తెలుగు", english: "Telugu" },
  ml: { native: "മലയാളം", english: "Malayalam" },
  mr: { native: "मराठी", english: "Marathi" },
  bn: { native: "বাংলা", english: "Bengali" },
  haryanvi: { native: "हरियाणवी", english: "Haryanvi" },
  en: { native: "English", english: "English" },
  es: { native: "Español", english: "Spanish" },
};

export type Tier = "free" | "pro";
export type Visibility = "private" | "friends" | "public";

export interface Track {
  id: string;
  ytVideoId: string;
  ytTitle: string;
  ytChannel: string;
  durationSec: number;
  spotifyId?: string;
  isrc?: string;
  title: string;
  primaryArtist: string;
  artists: string[];
  language: Language;
  album?: string;
  releaseYear?: number;
  artworkUrl: string;
  popularity: number;
  embeddedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  languages: Language[];
  spotifyId?: string;
  imageUrl?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferredLanguages: Language[];
  favoriteArtists: string[];
  tier: Tier;
  createdAt: string;
  lastActiveAt: string;
}

export interface Playlist {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  coverUrl: string;
  visibility: Visibility;
  collaborators: string[];
  trackIds: string[];
  createdBy: "user" | "ai";
  generatorPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export interface MeResponse {
  user: User;
  needsOnboarding: boolean;
}

export interface OnboardingRequest {
  languages: Language[];
  artists: string[];
  moods?: string[];
}

export interface OnboardingResponse {
  user: User;
  needsOnboarding: false;
}
