"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ui } from "@/content/home";

// Both icons render on the server; CSS picks one from the `.dark` class, so
// there's no hydration mismatch and no flash before the theme is known.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={ui.themeToggle}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
    >
      <Moon aria-hidden className="size-[18px] dark:hidden" strokeWidth={1.75} />
      <Sun aria-hidden className="hidden size-[18px] dark:block" strokeWidth={1.75} />
    </button>
  );
}
