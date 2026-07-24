"use client";
import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem("codealgo-theme") as Theme) ?? "dark"; } catch { return "dark"; }
  });

  // Imperative DOM sync only — reading the initial value moved to the lazy
  // useState initializer above, per react-hooks/set-state-in-effect.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("codealgo-theme", next);
  };

  return { theme, toggle };
}
