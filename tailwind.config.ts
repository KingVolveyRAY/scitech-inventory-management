import type { Config } from "tailwindcss";
import { designSystem } from "./lib/design-system";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: designSystem.colors.background,
          surface: designSystem.colors.surface,
          "surface-alt": designSystem.colors.surfaceAlt,
          border: designSystem.colors.border,
          primary: designSystem.colors.primary,
          "primary-hover": designSystem.colors.primaryHover,
          text: designSystem.colors.text,
          muted: designSystem.colors.muted
        }
      },
      borderRadius: {
        lg: designSystem.radii.input,
        xl: designSystem.radii.card
      },
      boxShadow: {
        subtle: designSystem.shadows.subtle,
        sophisticated: designSystem.shadows.sophisticated
      },
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
