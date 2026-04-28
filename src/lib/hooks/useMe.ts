"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiCallError } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import type { MeResponse } from "@/types/api";

export const ME_QUERY_KEY = ["me"] as const;

export function useMe() {
  const { status } = useAuth();
  return useQuery<MeResponse, ApiCallError>({
    queryKey: ME_QUERY_KEY,
    queryFn: () => api.me(),
    enabled: status === "signed-in",
    staleTime: 60_000,
  });
}
