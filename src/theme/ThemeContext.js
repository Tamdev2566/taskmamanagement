import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getMacOsTheme } from "../theme";

export const ThemeModeContext = createContext({
  mode: "dark",
  toggleTheme: () => {},
  setMode: () => {},
  isDark: true,
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    try {
      const savedMode = localStorage.getItem("dasher_macos_theme");
      if (savedMode === "light" || savedMode === "dark") {
        return savedMode;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "dark"; // Default to macOS Dark Pro
    } catch {
      return "dark";
    }
  });

  const setMode = (newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem("dasher_macos_theme", newMode);
    } catch {}
  };

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Sync class on <html> and <body> for CSS / Tailwind
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    root.style.colorScheme = mode;
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${mode}-mode`);
    document.body.style.backgroundColor = mode === "dark" ? "#16161a" : "#f5f5f7";
  }, [mode]);

  const muiTheme = useMemo(() => getMacOsTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
      isDark: mode === "dark",
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};
