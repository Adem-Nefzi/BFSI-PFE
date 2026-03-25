// src/components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { ClerkThemeProvider } from "./clerk-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkThemeProvider>{children}</ClerkThemeProvider>
    </ThemeProvider>
  );
}
