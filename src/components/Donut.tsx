import { CountUp } from "./CountUp";

/** Progress ring. The stroke draws itself in on load. */
export function Donut({ percent, size = 148, stroke = 13 }: { percent: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={`${percent}% done`}>
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6AEBFF" />
            <stop offset="0.55" stopColor="#6E53DE" />
            <stop offset="1" stopColor="#FF4081" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1F1942" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="animate-draw"
          style={{ ["--len" as string]: c, ["--off" as string]: off }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-snow">
          <CountUp value={percent} suffix="%" />
        </span>
        <span className="text-xs text-dusk">done</span>
      </div>
    </div>
  );
}
