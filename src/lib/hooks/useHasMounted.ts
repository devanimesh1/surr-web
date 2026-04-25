"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `true` once the component has hydrated on the client.
 * Useful for rendering theme/locale-dependent UI without causing
 * hydration mismatches.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
