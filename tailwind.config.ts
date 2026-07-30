import type { Config } from "tailwindcss";
import { themeConfig } from "../shared-core/styles/theme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "../shared-core/src/**/*.{ts,tsx}",
    "../shared-core/templates/**/*.{ts,tsx}",
    "../shared-core/auth/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...themeConfig.colors,
        primary: {
          DEFAULT: "#5B8FBF",
          foreground: "#FCFCFD",
          deep: "#3D6A94",
          soft: "#E8F0F8",
        },
        cta: {
          DEFAULT: "#F5D76E",
          foreground: "#2E2A1A",
          hover: "#E8B84A",
        },
        "accent-amber": {
          DEFAULT: "#E88B6A",
          foreground: "#FCFCFD",
        },
        savings: {
          DEFAULT: "#4CAF6E",
          foreground: "#1A2E22",
        },
        surface: {
          DEFAULT: "#F9FAFC",
          muted: "#F3F5F8",
        },
        foreground: "#1A1F2E",
        muted: {
          DEFAULT: "#F3F5F8",
          foreground: "#6B7280",
        },
        border: "#E2E5EB",
      },
      borderRadius: {
        ...themeConfig.borderRadius,
        lg: "0.625rem",
        md: "calc(0.625rem - 2px)",
        sm: "calc(0.625rem - 4px)",
      },
      fontFamily: {
        sans: [themeConfig.fonts.base],
      },
    },
  },
  plugins: [],
};

export default config;
