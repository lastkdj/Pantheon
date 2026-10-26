import { CountUp } from "./CountUp";

/** Semicircle gauge. The arc draws itself in on load. */
export function HalfGauge({ percent, label, width = 260 }: { percent: number; label: string; width?: number }) {
  const stroke = 22;
  const r = (width - stroke) / 2;
  const c = Math.PI * r; // half circumference
  const clamped = Math.min(Math.max(percent, 0), 100);
  const off = c * (1 - clamped / 100);
  const h = r + stroke / 2 + 2;
  return (
    <div className="relative mx-auto" style={{ width, height: h }}>
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} role="img" aria-label={`${clamped}% ${label}`}>
        <defs>
          <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C03CFF" />
            <stop offset="0.65" stopColor="#2D5BFF" />
            <stop offset="1" stopColor="#02C3FF" />
          </linearGradient>
        </defs>
        <path
          d={`M ${stroke / 2} ${r + stroke / 2} A ${r} ${r} 0 0 1 ${width - stroke / 2} ${r + stroke / 2}`}
          fill="none" stroke="#10205A" strokeWidth={stroke} strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${r + stroke / 2} A ${r} ${r} 0 0 1 ${width - stroke / 2} ${r + stroke / 2}`}
          fill="none" stroke="url(#gauge)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          className="animate-draw"
          style={{ ["--len" as string]: c, ["--off" as string]: off, strokeDashoffset: off }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="text-4xl font-extrabold leading-none text-snow"><CountUp value={clamped} suffix="%" /></span>
        <span className="mt-1.5 text-xs font-medium text-dusk">{label}</span>
      </div>
    </div>
  );
}
