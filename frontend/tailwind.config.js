/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode via class on <html>
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // ===================== BRAND COLORS =====================
      colors: {
        // Primary surface layers — Now reactive to CSS Variables
        surface: {
          DEFAULT: "var(--bg-primary)",
          1: "var(--bg-surface)",
          2: "var(--bg-card)",
          3: "var(--bg-elevated)",
          4: "var(--bg-elevated)",
        },
        // Brand accent — Reacts to Matrix Mode via CSS Variables
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dark: "#cc3700", // Keep fixed for now or map to another var
          glow: "var(--accent-glow)",
        },
        cyber: {
          cyan: "#00f0ff",
          green: "#39ff14",
        },
        // Semantic colors
        success: { DEFAULT: "#39ff14", light: "#66ff4d", glow: "rgba(57,255,20,0.2)" },
        warning: { DEFAULT: "#ffae42", light: "#ffc273", glow: "rgba(255,174,66,0.2)" },
        danger: { DEFAULT: "#ff003c", light: "#ff4d79", glow: "rgba(255,0,60,0.2)" },
        info: { DEFAULT: "#00f0ff", light: "#4dffff", glow: "rgba(0,240,255,0.2)" },

        // Muted text hierarchy
        muted: {
          DEFAULT: "var(--text-muted)",
          foreground: "var(--text-secondary)",
        },
        border: "var(--border)",
      },

      // ===================== TYPOGRAPHY =====================
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Mono", "JetBrains Mono", "monospace"], // Monospace for display
        mono: ["Space Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },

      // ===================== SPACING & SIZING =====================
      borderRadius: {
        "2xl": "0.25rem", // Brutalist sharp edges
        "3xl": "0.25rem",
        "4xl": "0.25rem",
        "xl": "0.125rem",
        "lg": "0.125rem",
      },

      // ===================== ANIMATIONS =====================
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.98)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "glow-pulse": { "0%, 100%": { boxShadow: "0 0 10px rgba(255,69,0,0.3)" }, "50%": { boxShadow: "0 0 25px rgba(255,69,0,0.6)" } },
        "shimmer": { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "spin-slow": { "from": { transform: "rotate(0deg)" }, "to": { transform: "rotate(360deg)" } },
        "slide-in-right": { "0%": { transform: "translateX(100%)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-up": "fade-up 0.3s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "slide-in-right": "slide-in-right 0.2s ease-out",
      },

      // ===================== BOX SHADOWS =====================
      boxShadow: {
        "glow-accent": "0 0 20px var(--accent-glow)",
        "glow-success": "0 0 15px rgba(57,255,20,0.3)",
        "glow-danger": "0 0 15px rgba(255,0,60,0.3)",
        "glass": "inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.5)", // Flat border + hard shadow
        "card": "4px 4px 0px var(--accent-glow), inset 0 0 0 1px rgba(255,255,255,0.1)", // Brutalist offset shadow
      },
    },
  },
  plugins: [],
};
