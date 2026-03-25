"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

export function ClerkThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: isDark ? "#60A5FA" : "#2563EB",
          colorBackground: isDark ? "#0F172A" : "#FFFFFF",
          colorInputBackground: isDark ? "#111827" : "#FFFFFF",
          colorInputText: isDark ? "#E2E8F0" : "#0F172A",
          colorText: isDark ? "#E2E8F0" : "#0F172A",
          colorTextSecondary: isDark ? "#94A3B8" : "#475569",
          borderRadius: "0.75rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
