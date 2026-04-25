/**
 * Shared API/domain types — manually mirrored from `surr-api/shared/src/types/`.
 * Keep in sync when updating the backend.
 */

export type Language = "pa" | "hi" | "ta" | "te" | "ml" | "mr" | "bn" | "haryanvi" | "en" | "es";

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
