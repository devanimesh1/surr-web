"use client";

import { useState, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";
import { useAuthListener } from "@/lib/hooks/useAuth";

function AuthBoundary({ children }: { children: ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={client}>
        <AuthBoundary>{children}</AuthBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
