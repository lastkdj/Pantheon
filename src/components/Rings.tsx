import { CountUp } from "./CountUp";

export interface RingSlice {
  label: string;
  value: number;
  /** Stroke gradient id suffix and colours. */
  from: string;
  to: string;
}

const SWEEP = 0.75; // each track covers 270 degrees, gap at the bottom left

/** Concentric radial arcs, one per slice, each filled to its share of the total. */
export function Rings({ slices, total, centerLabel, size = 232 }: { slices: RingSlice[]; total: number; centerLabel: string; size?: number }) {
  const stroke = 12;
  const gap = 9;
  const outer = (size - stroke) / 2;
  return (
    <div className="relative mx-auto shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={slices.map((s) => `${s.label} ${s.value} of ${total}`).join(", ")}>
        <defs>
          {slices.map((s, i) => (
            <linearGradient key={i} id={`ring-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={s.from} />
              <stop offset="1" stopColor={s.to} />
            </linearGradient>
          ))}
        </defs>
        {slices.map((s, i) => {
          const r = outer - i * (stroke + gap);
          const c = 2 * Math.PI * r;
          const track = c * SWEEP;
          const share = total === 0 ? 0 : Math.min(s.value / total, 1);
          const filled = track * share;
          const rotate = `rotate(135 ${size / 2} ${size / 2})`;
          return (
            <g key={s.label} transform={rotate}>
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#10205A" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${track} ${c}`} />
              {filled > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={`url(#ring-${i})`}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${Math.max(filled, 0.01)} ${c}`}
                  className="animate-draw"
                  style={{ ["--len" as string]: `${filled}px`, ["--off" as string]: "0px", animationDelay: `${i * 140}ms` }}
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-snow"><CountUp value={total} /></span>
        <span className="text-xs font-medium text-dusk">{centerLabel}</span>
      </div>
    </div>
  );
}
