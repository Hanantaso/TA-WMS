import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "reastock_theme";
const ALLOWED = new Set(["warm", "light", "dark"]);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("warm");

  // Load theme dari localStorage saat pertama kali
  useEffect(() => {
    try {
      const saved = (localStorage.getItem(THEME_KEY) || "").toLowerCase();
      if (ALLOWED.has(saved)) setThemeState(saved);
    } catch (e) {
      // ignore
    }
  }, []);

  // Apply theme ke <html data-theme="..."> + simpan
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next) => {
        const n = (next || "").toLowerCase();
        if (ALLOWED.has(n)) setThemeState(n);
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
