export const designSystem = {
  appName: "SIMS",
  colors: {
    background: "#f8fafc", // Light, slightly bluish slate
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    border: "#e2e8f0",
    primary: "#4f46e5", // Indigo remains strong
    primaryHover: "#4338ca",
    text: "#0f172a", // Very dark slate for contrast
    muted: "#64748b",
    destructive: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b"
  },
  radii: {
    card: "2rem", // 32px
    input: "0.75rem" // 12px
  },
  shadows: {
    subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
    sophisticated: "0 20px 40px -12px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.01)"
  },
  motion: {
    page: {
      duration: 0.3,
      y: 12
    },
    modal: {
      duration: 0.2,
      scale: 0.98
    },
    stagger: 0.06
  }
} as const;

export type DesignSystem = typeof designSystem;
