"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useAuthStore } from "@/lib/stores/auth";

/** Mounts the Firebase auth listener exactly once. Mount in a top-level provider. */
export function useAuthListener(): void {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
      });
    });
    return unsub;
  }, [setUser]);
}

export function useAuth() {
  return useAuthStore();
}
