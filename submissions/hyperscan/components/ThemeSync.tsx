"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }
  }, [resolvedTheme]);
  return null;
}


