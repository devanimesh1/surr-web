import { firebaseAuth } from "@/lib/firebase";
import type {
  ApiError,
  ApiResult,
  MeResponse,
  OnboardingRequest,
  OnboardingResponse,
} from "@/types/api";

export class ApiCallError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiCallError";
    this.code = error.code;
    this.details = error.details;
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type Method = "GET" | "POST" | "PATCH" | "DELETE";
type Params = Record<string, string | number | boolean | undefined | null>;

interface CallOptions {
  params?: Params;
  signal?: AbortSignal;
}

async function call<TRes>(
  method: Method,
  path: string,
  body?: unknown,
  opts?: CallOptions,
): Promise<TRes> {
  if (!baseUrl) {
    throw new ApiCallError({
      code: "CONFIG_MISSING",
      message: "NEXT_PUBLIC_API_BASE_URL is not set",
    });
  }
  const url = new URL(path.startsWith("/") ? path.slice(1) : path, baseUrl + "/");
  for (const [k, v] of Object.entries(opts?.params ?? {})) {
    if (v != null) url.searchParams.set(k, String(v));
  }

  const headers: Record<string, string> = { "content-type": "application/json" };
  const user = firebaseAuth().currentUser;
  if (user) {
    headers.authorization = `Bearer ${await user.getIdToken()}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: opts?.signal,
  });

  let json: ApiResult<TRes>;
  try {
    json = (await res.json()) as ApiResult<TRes>;
  } catch {
    throw new ApiCallError({
      code: "BAD_RESPONSE",
      message: `Non-JSON response (status ${res.status})`,
    });
  }

  if (!json.ok) throw new ApiCallError(json.error);
  return json.data;
}

export const api = {
  me: () => call<MeResponse>("GET", "/me"),
  submitOnboarding: (payload: OnboardingRequest) =>
    call<OnboardingResponse>("POST", "/me/onboarding", payload),
};

export type Api = typeof api;
