import type { Config } from "tailwindcss";

// Pantheon palette, sampled from the design reference: deep indigo panels, electric violet,
// blue and teal tiles, one hot-pink action, on a lavender canvas.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#16122A", // deepest base, chart wells
        "night-2": "#1F1942", // inset surfaces
        "night-3": "#25204D", // panels and cards
        "night-4": "#2F2962", // hovered panels
        edge: "rgba(255,255,255,0.08)",
        snow: "#F5F3FF",
        mist: "#B9B4E6",
        dusk: "#9C97CF",
        violet: "#6E53DE",
        "violet-hi": "#A99DFF",
        azure: "#2050F6",
        "azure-hi": "#7C9CFF",
        teal: "#0A9495",
        mint: "#2FD6B5",
        coral: "#FF4081",
        lavender: "#C1BEFC",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        frame: "0 40px 90px -30px rgba(40,24,120,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        glow: "0 18px 40px -12px rgba(110,83,222,0.7)",
        "glow-blue": "0 18px 36px -14px rgba(32,80,246,0.8)",
        "glow-teal": "0 18px 36px -14px rgba(10,148,149,0.8)",
        "glow-pink": "0 10px 26px -6px rgba(255,64,129,0.7)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        pop: { from: { opacity: "0", transform: "scale(0.94)" }, to: { opacity: "1", transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
        blink: { "0%,92%,100%": { transform: "scaleY(1)" }, "96%": { transform: "scaleY(0.1)" } },
        grow: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        growY: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        draw: { from: { strokeDashoffset: "var(--len)" }, to: { strokeDashoffset: "var(--off)" } },
        pulse: { "0%": { boxShadow: "0 0 0 0 rgba(255,64,129,0.55)" }, "100%": { boxShadow: "0 0 0 10px rgba(255,64,129,0)" } },
        drift: { "0%,100%": { transform: "translate(0,0)" }, "50%": { transform: "translate(24px,-18px)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        rise: "rise 600ms cubic-bezier(.2,.7,.2,1) both",
        pop: "pop 450ms cubic-bezier(.2,.8,.2,1) both",
        float: "float 3.6s ease-in-out infinite",
        blink: "blink 5s infinite",
        grow: "grow 900ms cubic-bezier(.2,.7,.2,1) both",
        growY: "growY 900ms cubic-bezier(.2,.7,.2,1) both",
        draw: "draw 1400ms cubic-bezier(.3,.7,.2,1) both",
        pulse: "pulse 1.8s ease-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
