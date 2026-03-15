const accent = "#7C5CBF";
const accentLight = "#9B7DD4";
const accentDark = "#5A3F96";

const accentDarkMode = "#A986E0";
const accentDarkModeLight = "#BFA3EC";
const accentDarkModeDark = "#7C5CBF";

export type ColorScheme = typeof colors.light;

const colors = {
  light: {
    text: "#1A1A2E",
    textSecondary: "#6B6B8A",
    background: "#F8F7FF",
    backgroundSecondary: "#EEEAF8",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    border: "#E0D8F5",
    tint: accent,
    tintLight: accentLight,
    tintDark: accentDark,
    tabIconDefault: "#9B9BB0",
    tabIconSelected: accent,
    note: "#7C5CBF",
    noteRoot: "#E8401C",
    noteHighlight: "#F0B429",
    chord: {
      major: "#2563EB",
      minor: "#7C3AED",
      diminished: "#DC2626",
      augmented: "#D97706",
      dominant: "#059669",
    },
    stepWhole: "#7C5CBF",
    stepHalf: "#E8401C",
    circleActive: "#7C5CBF",
    circleInactive: "#D1C4E9",
  },
  dark: {
    text: "#EDE9FF",
    textSecondary: "#9B96C0",
    background: "#0D0B18",
    backgroundSecondary: "#17142A",
    surface: "#1C1929",
    surfaceElevated: "#231F35",
    border: "#2C2844",
    tint: accentDarkMode,
    tintLight: accentDarkModeLight,
    tintDark: accentDarkModeDark,
    tabIconDefault: "#6B6880",
    tabIconSelected: accentDarkMode,
    note: accentDarkMode,
    noteRoot: "#FF6A47",
    noteHighlight: "#FFC930",
    chord: {
      major: "#4D90FF",
      minor: "#A87AFF",
      diminished: "#FF5252",
      augmented: "#FFB74D",
      dominant: "#26D89A",
    },
    stepWhole: accentDarkMode,
    stepHalf: "#FF6A47",
    circleActive: accentDarkMode,
    circleInactive: "#2C2844",
  },
};

export default colors;
