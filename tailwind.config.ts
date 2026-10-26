import type { Config } from "tailwindcss";

// Pantheon palette, sampled from the owner's two dashboard references:
// deep navy surfaces, with neon magenta, electric blue and cyan as the data colours.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#081026", // page
        "night-2": "#0A1432", // wells, inset rows
        "night-3": "#0B173A", // panels
        "night-4": "#10205A", // hovered panels
        edge: "rgba(120,150,255,0.13)",
        snow: "#F2F5FF",
        mist: "#B4BEE0",
        dusk: "#8592C4",
        violet: "#8B2CF5",
        "violet-hi": "#C77DFF",
        magenta: "#CE3CFD",
        "magenta-hi": "#E58BFF",
        azure: "#2D5BFF",
        "azure-hi": "#7F9DFF",
        cyan: "#02C3FF",
        teal: "#0A9495",
        mint: "#2DD4A0",
        coral: "#FF5C7A",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 30px -10px rgba(206,60,253,0.55)",
        "glow-blue": "0 10px 30px -10px rgba(45,91,255,0.7)",
        "glow-cyan": "0 10px 30px -10px rgba(2,195,255,0.6)",
        panel: "0 20px 40px -24px rgba(0,0,0,0.6)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        grow: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        growY: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        draw: { from: { strokeDashoffset: "var(--len)" }, to: { strokeDashoffset: "var(--off)" } },
        ping: { "0%": { boxShadow: "0 0 0 0 rgba(45,212,160,0.6)" }, "100%": { boxShadow: "0 0 0 8px rgba(45,212,160,0)" } },
        sweep: { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(100%)" } },
      },
      animation: {
        rise: "rise 600ms cubic-bezier(.2,.7,.2,1) both",
        fade: "fade 500ms ease-out both",
        grow: "grow 900ms cubic-bezier(.2,.7,.2,1) both",
        growY: "growY 1000ms cubic-bezier(.2,.7,.2,1) both",
        draw: "draw 1500ms cubic-bezier(.3,.7,.2,1) both",
        ping: "ping 2s ease-out infinite",
        sweep: "sweep 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
