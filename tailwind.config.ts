import type { Config } from "tailwindcss";

// Void design tokens (copied from MyGold DESIGN_SYSTEM.md, section 2).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "void-black": "#050609",
        "void-navy": "#0A0D15",
        "gunmetal-grey": "#1A1F2C",
        "aethelred-gold": "#CBA052",
        "void-gold-light": "#E9C684",
        "slate-grey": "#A8B1C2",
        "muted-grey": "#5C6472",
        "panel-heading": "#F5EBD3",
        "row-title": "#F0E4CC",
        "list-text": "#C9D0DB",
        destruction: "hsl(0, 84%, 60%)",
        success: "hsl(142, 71%, 45%)",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
