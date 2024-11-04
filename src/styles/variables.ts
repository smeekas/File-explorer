import { ThemeOptions } from "@mui/material";
export const colors = {
  // Primary colors with extended shades
  primary: {
    50: "#E3F2FD", // Lightest - for subtle backgrounds
    100: "#BBDEFB", // Very light - alternate selection
    200: "#90CAF9", // Light - hover states
    300: "#64B5F6", // Medium light - secondary actions
    400: "#42A5F5", // Medium - highlights
    500: "#2196F3", // Main - primary actions
    600: "#1E88E5", // Medium dark - pressed states
    700: "#1976D2", // Dark - active states
    800: "#1565C0", // Very dark - contrast elements
    900: "#0D47A1", // Darkest - special emphasis
    main: "#2196F3", // Primary brand color (same as 500)
    light: "#E3F2FD", // Selection background (same as 50)
    dark: "#1976D2", // Emphasis (same as 700)
    contrast: "#FFFFFF",
  },

  // Neutral colors with specific use cases
  neutral: {
    50: "#FAFAFA", // Lightest background
    100: "#F5F5F5", // Alternative background
    200: "#EEEEEE", // Hover states
    300: "#E0E0E0", // Borders
    400: "#BDBDBD", // Disabled elements
    500: "#9E9E9E", // Subtle text
    600: "#757575", // Secondary text
    700: "#616161", // Medium emphasis text
    800: "#424242", // High emphasis text
    900: "#212121", // Highest emphasis text

    // Specific interface colors
    white: "#FFFFFF", // Pure white backgrounds
    background: "#F5F7FA", // Main background
    surface: "#FFFFFF", // Surface elements
    border: "#E0E0E0", // Borders (same as 300)
    divider: "#E0E0E0", // Divider lines
    overlay: "rgba(0, 0, 0, 0.05)", // Overlay effects
  },

  // Interface-specific colors
  interface: {
    background: "#FFFFFF", // Main background
    sidebar: "#F5F7FA", // Sidebar background
    border: "#E0E0E0", // Borders and dividers
    hover: "#F5F5F5", // Hover state
    selected: "#E3F2FD", // Selected item background
    focus: "rgba(33, 150, 243, 0.12)", // Focus ring
    disabled: "#F5F5F5", // Disabled background
    skeleton: "#F0F0F0", // Loading skeleton
  },

  // Text colors with hierarchy
  text: {
    primary: "#212121", // Primary text (same as neutral.900)
    secondary: "#757575", // Secondary text (same as neutral.600)
    disabled: "#BDBDBD", // Disabled text (same as neutral.400)
    hint: "#9E9E9E", // Hint text
    inverse: "#FFFFFF", // Text on dark backgrounds
  },

  // Status colors for file states
  status: {
    modified: {
      light: "#FFE0B2",
      main: "#FFA000",
      dark: "#FF8F00",
      contrast: "#000000",
    },
    new: {
      light: "#C8E6C9",
      main: "#4CAF50",
      dark: "#388E3C",
      contrast: "#FFFFFF",
    },
    error: {
      light: "#FFCDD2",
      main: "#F44336",
      dark: "#D32F2F",
      contrast: "#FFFFFF",
    },
    warning: {
      light: "#FFE0B2",
      main: "#FF9800",
      dark: "#F57C00",
      contrast: "#000000",
    },
    info: {
      light: "#E3F2FD",
      main: "#2196F3",
      dark: "#1976D2",
      contrast: "#FFFFFF",
    },
  },

  // Dark mode colors
  dark: {
    interface: {
      background: "#121212",
      sidebar: "#1E1E1E",
      border: "#2D2D2D",
      hover: "#2D2D2D",
      selected: "#1E3A57",
      focus: "rgba(144, 202, 249, 0.16)",
      disabled: "#222222",
      skeleton: "#262626",
    },
    neutral: {
      50: "#1E1E1E",
      100: "#222222",
      200: "#262626",
      300: "#2D2D2D",
      400: "#353535",
      500: "#404040",
      600: "#505050",
      700: "#656565",
      800: "#7E7E7E",
      900: "#9E9E9E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
      disabled: "#666666",
      hint: "#787878",
      inverse: "#212121",
    },
  },
};
export const generateMuiThemeColors: () => ThemeOptions["palette"] = () => ({
  primary: {
    50: colors.primary[50],
    100: colors.primary[100],
    200: colors.primary[200],
    300: colors.primary[300],
    400: colors.primary[400],
    500: colors.primary[500],
    600: colors.primary[600],
    700: colors.primary[700],
    800: colors.primary[800],
    900: colors.primary[900],
    main: colors.primary.main,
    light: colors.primary.light,
    dark: colors.primary.dark,
    contrastText: colors.primary.contrast,
  },
  grey: colors.neutral,
  background: {
    default: colors.interface.background,
    paper: colors.interface.sidebar,
  },
  text: colors.text,
  divider: colors.interface.border,
  action: {
    hover: colors.interface.hover,
    selected: colors.interface.selected,
    disabled: colors.interface.disabled,
    focus: colors.interface.focus,
    disabledBackground: colors.interface.disabled,
  },
  error: colors.status.error,
  warning: colors.status.warning,
  info: colors.status.info,
  success: colors.status.new,
});

export const generateCssVariables = () => {
  const variables = {
    // Primary shades
    "--color-primary-50": colors.primary[50],
    "--color-primary-100": colors.primary[100],
    "--color-primary-200": colors.primary[200],
    "--color-primary-300": colors.primary[300],
    "--color-primary-400": colors.primary[400],
    "--color-primary-500": colors.primary[500],
    "--color-primary-600": colors.primary[600],
    "--color-primary-700": colors.primary[700],
    "--color-primary-800": colors.primary[800],
    "--color-primary-900": colors.primary[900],
    "--color-primary": colors.primary.main,
    "--color-primary-light": colors.primary.light,
    "--color-primary-dark": colors.primary.dark,

    // Neutral shades
    "--color-neutral-50": colors.neutral[50],
    "--color-neutral-100": colors.neutral[100],
    "--color-neutral-200": colors.neutral[200],
    "--color-neutral-300": colors.neutral[300],
    "--color-neutral-400": colors.neutral[400],
    "--color-neutral-500": colors.neutral[500],
    "--color-neutral-600": colors.neutral[600],
    "--color-neutral-700": colors.neutral[700],
    "--color-neutral-800": colors.neutral[800],
    "--color-neutral-900": colors.neutral[900],

    // Interface colors
    "--color-background": colors.interface.background,
    "--color-sidebar": colors.interface.sidebar,
    "--color-border": colors.interface.border,
    "--color-hover": colors.interface.hover,
    "--color-selected": colors.interface.selected,
    "--color-focus": colors.interface.focus,
    "--color-disabled": colors.interface.disabled,
    "--color-skeleton": colors.interface.skeleton,
    "--color-overlay": colors.neutral.overlay,

    // Text colors
    "--color-text-primary": colors.text.primary,
    "--color-text-secondary": colors.text.secondary,
    "--color-text-disabled": colors.text.disabled,
    "--color-text-hint": colors.text.hint,
    "--color-text-inverse": colors.text.inverse,

    // Status colors
    "--color-modified": colors.status.modified.main,
    "--color-modified-light": colors.status.modified.light,
    "--color-new": colors.status.new.main,
    "--color-new-light": colors.status.new.light,
    "--color-error": colors.status.error.main,
    "--color-error-light": colors.status.error.light,
    "--color-warning": colors.status.warning.main,
    "--color-warning-light": colors.status.warning.light,
    "--color-info": colors.status.info.main,
    "--color-info-light": colors.status.info.light,
  };

  return variables;
  // return cssVariables;
};
export const generateCssVariablesStyle = () => {
  const root = Object.entries(generateCssVariables())
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ");

  return `
    :root {
      ${root}
    }
   
  `;
};
