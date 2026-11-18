import { createTheme } from "@mui/material/styles";

// Authentic Apple macOS Design System Palette (macOS Sequoia / Sonoma HIG)
export const macColors = {
  light: {
    canvas: "#f5f5f7",
    surface: "#ffffff",
    surfaceTranslucent: "rgba(255, 255, 255, 0.78)",
    surfaceElevated: "#ffffff",
    surfaceHover: "rgba(0, 0, 0, 0.04)",
    surfaceActive: "rgba(0, 0, 0, 0.07)",
    sidebar: "rgba(246, 246, 248, 0.88)",
    header: "rgba(255, 255, 255, 0.82)",
    border: "rgba(0, 0, 0, 0.08)",
    borderSubtle: "rgba(0, 0, 0, 0.05)",
    borderStrong: "rgba(0, 0, 0, 0.14)",
    textPrimary: "#1d1d1f",
    textSecondary: "#86868b",
    textTertiary: "#a1a1a6",
    blue: "#0071e3",
    blueLight: "#47a3ff",
    blueDark: "#0058b0",
    blueSoft: "rgba(0, 113, 227, 0.09)",
    indigo: "#5856d6",
    indigoSoft: "rgba(88, 86, 214, 0.09)",
    purple: "#af52de",
    green: "#34c759",
    greenSoft: "rgba(52, 199, 89, 0.12)",
    orange: "#ff9500",
    orangeSoft: "rgba(255, 149, 0, 0.12)",
    red: "#ff3b30",
    redSoft: "rgba(255, 59, 48, 0.12)",
    shadowXs: "0 1px 2px rgba(0, 0, 0, 0.04)",
    shadowSm: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    shadowMd: "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)",
    shadowLg: "0 20px 48px -8px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.06)",
  },
  dark: {
    canvas: "#131316",
    surface: "#1c1c21",
    surfaceTranslucent: "rgba(28, 28, 33, 0.78)",
    surfaceElevated: "#25252b",
    surfaceHover: "rgba(255, 255, 255, 0.05)",
    surfaceActive: "rgba(255, 255, 255, 0.09)",
    sidebar: "rgba(20, 20, 24, 0.88)",
    header: "rgba(24, 24, 29, 0.82)",
    border: "rgba(255, 255, 255, 0.08)",
    borderSubtle: "rgba(255, 255, 255, 0.05)",
    borderStrong: "rgba(255, 255, 255, 0.15)",
    textPrimary: "#f5f5f7",
    textSecondary: "#98989d",
    textTertiary: "#6e6e73",
    blue: "#0a84ff",
    blueLight: "#409cff",
    blueDark: "#0066cc",
    blueSoft: "rgba(10, 132, 255, 0.15)",
    indigo: "#5e5ce6",
    indigoSoft: "rgba(94, 92, 230, 0.15)",
    purple: "#bf5af2",
    green: "#30d158",
    greenSoft: "rgba(48, 209, 88, 0.15)",
    orange: "#ff9f0a",
    orangeSoft: "rgba(255, 159, 10, 0.15)",
    red: "#ff453a",
    redSoft: "rgba(255, 69, 58, 0.15)",
    shadowXs: "0 1px 2px rgba(0, 0, 0, 0.35)",
    shadowSm: "0 2px 10px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.08)",
    shadowMd: "0 12px 32px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.12)",
    shadowLg: "0 25px 60px -10px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.15)",
  },
};

export const getMacOsTheme = (mode = "dark") => {
  const isDark = mode === "dark";
  const c = isDark ? macColors.dark : macColors.light;

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: c.blue,
        light: c.blueLight,
        dark: c.blueDark,
        contrastText: "#ffffff",
      },
      secondary: {
        main: c.indigo,
        light: "#7d7aff",
        dark: "#3f3d99",
        contrastText: "#ffffff",
      },
      success: {
        main: c.green,
        light: "#5cd37b",
        dark: "#248a3d",
        contrastText: "#ffffff",
      },
      warning: {
        main: c.orange,
        light: "#ffb340",
        dark: "#cc7700",
        contrastText: "#ffffff",
      },
      error: {
        main: c.red,
        light: "#ff6961",
        dark: "#cc2922",
        contrastText: "#ffffff",
      },
      info: {
        main: c.blue,
      },
      background: {
        default: c.canvas,
        paper: c.surface,
        glass: c.surfaceTranslucent,
        subtle: isDark ? "#17171c" : "#f0f0f3",
      },
      text: {
        primary: c.textPrimary,
        secondary: c.textSecondary,
        disabled: c.textTertiary,
      },
      divider: c.border,
      action: {
        hover: c.surfaceHover,
        selected: c.blueSoft,
      },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"SF Pro Display"',
        '"SF Pro Text"',
        '"SF Pro"',
        '"Helvetica Neue"',
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),
      h1: { fontWeight: 700, letterSpacing: "-0.03em" },
      h2: { fontWeight: 700, letterSpacing: "-0.025em" },
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 650, letterSpacing: "-0.015em" },
      h6: { fontWeight: 650, letterSpacing: "-0.01em" },
      subtitle1: { fontWeight: 600, letterSpacing: "-0.01em" },
      subtitle2: { fontWeight: 600, letterSpacing: "-0.005em" },
      body1: { fontSize: "0.925rem", lineHeight: 1.5, letterSpacing: "-0.005em" },
      body2: { fontSize: "0.85rem", lineHeight: 1.45, letterSpacing: "-0.003em" },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: "-0.01em" },
      caption: { fontSize: "0.75rem", letterSpacing: "0.01em" },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: c.canvas,
            color: c.textPrimary,
            transition: "background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            padding: "7px 15px",
            transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:active": {
              transform: "scale(0.97)",
            },
          },
          containedPrimary: {
            backgroundColor: c.blue,
            color: "#ffffff",
            boxShadow: isDark
              ? "0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0.5px rgba(255,255,255,0.25)"
              : "0 1px 3px rgba(0,113,227,0.3), inset 0 1px 0.5px rgba(255,255,255,0.3)",
            "&:hover": {
              backgroundColor: isDark ? "#409cff" : "#0077ed",
              boxShadow: isDark
                ? "0 4px 12px rgba(10,132,255,0.4)"
                : "0 4px 12px rgba(0,113,227,0.35)",
            },
          },
          outlined: {
            borderColor: c.borderStrong,
            color: c.textPrimary,
            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            "&:hover": {
              borderColor: c.blue,
              backgroundColor: c.blueSoft,
              color: c.blue,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: c.surface,
            color: c.textPrimary,
            borderRadius: "14px",
            border: `1px solid ${c.border}`,
            boxShadow: c.shadowSm,
            transition: "background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          },
          elevation1: { boxShadow: c.shadowXs },
          elevation2: { boxShadow: c.shadowSm },
          elevation3: { boxShadow: c.shadowMd },
          elevation4: { boxShadow: c.shadowLg },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: c.surface,
            color: c.textPrimary,
            borderRadius: "14px",
            border: `1px solid ${c.border}`,
            boxShadow: c.shadowSm,
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.75rem",
            height: 24,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: c.border,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: c.borderStrong,
            },
            "&.Mui-focused": {
              backgroundColor: isDark ? "rgba(10, 132, 255, 0.06)" : "rgba(0, 113, 227, 0.04)",
              boxShadow: `0 0 0 3px ${isDark ? "rgba(10, 132, 255, 0.25)" : "rgba(0, 113, 227, 0.18)"}`,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: c.blue,
                borderWidth: "1.5px",
              },
            },
          },
          input: {
            padding: "9px 13px",
            fontSize: "0.875rem",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "18px",
            boxShadow: c.shadowLg,
            border: `1px solid ${c.border}`,
            backgroundColor: isDark ? "rgba(28, 28, 34, 0.94)" : "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(30px) saturate(190%)",
            WebkitBackdropFilter: "blur(30px) saturate(190%)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${c.borderSubtle}`,
            padding: "11px 16px",
            fontSize: "0.85rem",
            color: c.textPrimary,
          },
          head: {
            fontWeight: 650,
            fontSize: "0.72rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: c.textSecondary,
            backgroundColor: isDark ? "rgba(25, 25, 30, 0.75)" : "rgba(245, 245, 247, 0.75)",
            backdropFilter: "blur(10px)",
          },
        },
      },
    },
  });
};

export default getMacOsTheme;
