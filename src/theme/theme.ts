import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.border.medium,
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.025em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.015em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "0.02em" },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.57 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          color: colors.text.primary,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: colors.shadow.sm,
          border: `1px solid ${colors.border.light}`,
          backgroundImage: "none",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: colors.shadow.md,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 22px",
          fontWeight: 600,
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: colors.shadow.sm,
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          background: colors.primary.gradient,
          "&:hover": {
            background: colors.primary.gradient,
            boxShadow: colors.shadow.glowPrimary,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease-in-out",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary.light,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary.main,
              borderWidth: "2px",
            },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          borderRadius: 8,
          fontSize: "0.75rem",
          fontWeight: 600,
          padding: "8px 12px",
          boxShadow: colors.shadow.md,
        },
        arrow: {
          color: "#0F172A",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.navbar,
          color: colors.text.primary,
          boxShadow: "none",
          borderBottom: `1px solid ${colors.border.medium}`,
          backdropFilter: "blur(12px)",
        },
      },
    },
  },
});

export default theme;