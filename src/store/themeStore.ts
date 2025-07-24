import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Internal
  setResolvedTheme: (theme: "light" | "dark") => void;
}

/**
 * Theme store using Zustand for global theme management
 * Persists theme preference in localStorage
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",

      setTheme: (theme) => {
        set({ theme });

        // Update resolved theme based on selection
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          get().setResolvedTheme(systemTheme);
        } else {
          get().setResolvedTheme(theme);
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        if (theme === "system") {
          // If system, switch to opposite of current resolved theme
          const newTheme = get().resolvedTheme === "light" ? "dark" : "light";
          get().setTheme(newTheme);
        } else {
          // Toggle between light and dark
          const newTheme = theme === "light" ? "dark" : "light";
          get().setTheme(newTheme);
        }
      },

      setResolvedTheme: (resolvedTheme) => {
        set({ resolvedTheme });

        // Update document class for Tailwind dark mode
        if (resolvedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
