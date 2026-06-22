export const colors = {
  bgPrimary: "#090B0F",
  bgSecondary: "#0D1117",
  bgCard: "#111620",
  bgHover: "#1A2030",
  border: "#1E2532",
  borderSubtle: "#151B26",
  accent: "#4F8CFF",
  accentSoft: "rgba(79,140,255,0.12)",
  textPrimary: "#E8EBF0",
  textSecondary: "#8B9DB5",
  textMuted: "#4A5568",
  green: "#2FBF71",
  greenBg: "rgba(47,191,113,0.12)",
  orange: "#F5A524",
  orangeBg: "rgba(245,165,36,0.12)",
  red: "#EF4444",
  redBg: "rgba(239,68,68,0.12)",
  purple: "#A78BFA",
  purpleBg: "rgba(167,139,250,0.12)",
};

export const diffColor: Record<string, string> = {
  Easy: colors.green,
  Medium: colors.orange,
  Hard: colors.red,
};
export const diffBg: Record<string, string> = {
  Easy: colors.greenBg,
  Medium: colors.orangeBg,
  Hard: colors.redBg,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
};

export const font = {
  size: {
    xs: 10,
    sm: 12,
    base: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
};

export const companyColors: Record<string, string> = {
  Google: "#4F8CFF",
  Amazon: "#F5A524",
  Meta: "#A78BFA",
  Facebook: "#A78BFA",
  Apple: "#9499C0",
  Microsoft: "#22D587",
  LinkedIn: "#0EA5E9",
  Netflix: "#EF4444",
};
