import { useId } from "react";
import { mascotTraits } from "@/lib/mascot-traits";

/** One little creature per agent role: same role, same creature, everywhere. */

const PALETTES = [
  { body: "#F7B84B", shade: "#D98A22", accent: "#2050F6" }, // amber
  { body: "#35D0C4", shade: "#14A0A0", accent: "#16122A" }, // teal
  { body: "#FF5E7A", shade: "#D6385A", accent: "#2FD6B5" }, // coral
  { body: "#9A86FF", shade: "#6E53DE", accent: "#FFE08A" }, // violet
  { body: "#A6E85F", shade: "#6FBF3A", accent: "#6E53DE" }, // lime
  { body: "#63B7FF", shade: "#2F7FE6", accent: "#FF4081" }, // sky
  { body: "#FF9A57", shade: "#E0661F", accent: "#2050F6" }, // orange
  { body: "#FF8FD0", shade: "#D9559F", accent: "#16122A" }, // pink
];

const BODIES = [
  // bean
  "M50 12C74 12 86 34 86 62C86 90 74 108 50 108C26 108 14 90 14 62C14 34 26 12 50 12Z",
  // ghost
  "M20 100C14 72 16 42 32 24C42 12 58 12 68 24C84 42 86 72 80 100Q71 91 65 101Q57 110 50 101Q43 110 35 101Q29 91 20 100Z",
  // round
  "M50 20C74 20 90 38 90 62C90 88 74 106 50 106C26 106 10 88 10 62C10 38 26 20 50 20Z",
  // squircle with ears
  "M22 40C22 26 34 20 50 20C66 20 78 26 78 40L84 92C84 102 74 108 50 108C26 108 16 102 16 92Z",
];

export function Mascot({
  role,
  size = 56,
  animate = true,
  className = "",
}: {
  role: string;
  size?: number;
  /** Idle float and blink. Turn off for small repeated avatars. */
  animate?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const t = mascotTraits(role);
  const pal = PALETTES[t.palette];
  const body = BODIES[t.body];
  const eyes = t.eyes; // googly, cyclops, visor
  const extra = t.extra; // none, antenna, ears
  const mouth = t.mouth;
  const delay = `${t.delay}s`;
  const isEars = extra === 2 && t.body === 3;

  return (
    <svg
      viewBox="0 0 100 124"
      width={size}
      height={size * 1.24}
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={`b${uid}`} cx="32%" cy="26%" r="85%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor={pal.body} />
          <stop offset="1" stopColor={pal.shade} />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="114" rx="30" ry="5" fill="#000" opacity="0.28" />
      <g className={animate ? "animate-float" : ""} style={animate ? { animationDelay: delay } : undefined}>
        {extra === 1 && (
          <g>
            <line x1="50" y1="14" x2="50" y2="2" stroke={pal.shade} strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="3" r="5" fill={pal.accent === "#16122A" ? "#FFE08A" : pal.accent} />
          </g>
        )}
        {isEars && (
          <g fill={pal.shade}>
            <path d="M24 34L28 8L46 24Z" />
            <path d="M76 34L72 8L54 24Z" />
          </g>
        )}
        <path d={body} fill={`url(#b${uid})`} />
        <path d={body} fill="none" stroke="#fff" strokeOpacity="0.12" />
        <g className={animate ? "animate-blink" : ""} style={{ transformOrigin: "50px 58px", transformBox: "fill-box", animationDelay: delay }}>
          {eyes === 0 && (
            <g>
              <circle cx="36" cy="58" r="10" fill="#fff" />
              <circle cx="64" cy="58" r="10" fill="#fff" />
              <circle cx="38" cy="60" r="5" fill="#1B1640" />
              <circle cx="62" cy="60" r="5" fill="#1B1640" />
              <circle cx="40" cy="58" r="1.8" fill="#fff" />
              <circle cx="64" cy="58" r="1.8" fill="#fff" />
            </g>
          )}
          {eyes === 1 && (
            <g>
              <circle cx="50" cy="56" r="15" fill="#fff" />
              <circle cx="52" cy="58" r="7" fill="#1B1640" />
              <circle cx="55" cy="55" r="2.2" fill="#fff" />
            </g>
          )}
          {eyes === 2 && (
            <g>
              <rect x="22" y="46" width="56" height="24" rx="12" fill={pal.accent === "#16122A" ? "#16122A" : "#0F1B3D"} />
              <rect x="22" y="46" width="56" height="24" rx="12" fill="none" stroke="#fff" strokeOpacity="0.25" />
              <circle cx="38" cy="58" r="5.5" fill="#6AEBFF" />
              <circle cx="62" cy="58" r="5.5" fill="#6AEBFF" />
            </g>
          )}
        </g>
        {mouth === 0 && <path d="M41 82Q50 90 59 82" stroke="#1B1640" strokeWidth="3" strokeLinecap="round" fill="none" />}
        {mouth === 1 && <path d="M43 85H57" stroke="#1B1640" strokeWidth="3" strokeLinecap="round" />}
        {mouth === 2 && <ellipse cx="50" cy="85" rx="5" ry="4" fill="#1B1640" />}
      </g>
    </svg>
  );
}
