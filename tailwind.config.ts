import type { Config } from "tailwindcss";

// Pantheon palette: ink (night sky), marble (text), bronze (accent), plus one hue per task status.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0D14",
        "ink-2": "#10141E",
        "ink-3": "#171C29",
        line: "#232A3B",
        marble: "#ECE6D8",
        stone: "#A5AEBF",
        ash: "#7C869B",
        bronze: "#C9A45C",
        "bronze-hi": "#E3C37F",
        lapis: "#7C9AE0",
        verdigris: "#5EA98B",
        oxblood: "#D2604F",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        sans: ["Instrument Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        grow: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      animation: { grow: "grow 700ms cubic-bezier(.2,.7,.2,1) both" },
    },
  },
  plugins: [],
};

export default config;
