"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      className="px-3 py-1.5 rounded-lg border text-sm border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        // Ensure html gets the class immediately as a safeguard
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
      }}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}


