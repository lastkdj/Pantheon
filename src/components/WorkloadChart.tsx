"use client";

import { useState } from "react";
import { Mascot } from "./Mascot";

export interface WorkloadItem {
  owner: string;
  open: number;
  done: number;
  inProgress: number;
}

const H = 176; // plot height in px

export function WorkloadChart({ items }: { items: WorkloadItem[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...items.map((w) => w.open + w.done), 1);
  const top = Math.ceil(max / 4) * 4 || 4;
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(top * f));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-snow">Workload by agent</h3>
        <ul className="flex gap-4 text-xs text-mist">
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet" />Open</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-mint" />Done</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <div className="relative w-6 shrink-0 text-right text-[11px] text-dusk" style={{ height: H }} aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: (i / 4) * H }}>{t}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:thin]">
          <div className="relative" style={{ minWidth: items.length * 64 }}>
            <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: H }} aria-hidden="true">
              {ticks.map((_, i) => (
                <div key={i} className="absolute inset-x-0 border-t border-dashed border-white/[0.07]" style={{ top: (i / 4) * H }} />
              ))}
            </div>
            <ul className="relative flex items-end" style={{ height: H }}>
              {items.map((w, i) => {
                const total = w.open + w.done;
                return (
                  <li key={w.owner} className="relative flex h-full flex-1 items-end justify-center">
                    <button
                      type="button"
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                      aria-label={`${w.owner}: ${w.open} open, ${w.done} done`}
                      className="relative flex h-full w-9 items-end rounded-t-xl"
                    >
                      <span
                        className={`flex w-full origin-bottom animate-growY flex-col justify-end overflow-hidden rounded-t-xl transition-opacity duration-300 ${hover !== null && hover !== i ? "opacity-35" : "opacity-100"}`}
                        style={{ height: (total / top) * H, animationDelay: `${i * 60}ms` }}
                      >
                        <span className="bg-gradient-to-b from-[#8A72FF] to-violet" style={{ height: `${(w.open / Math.max(total, 1)) * 100}%` }} />
                        <span className="bg-gradient-to-b from-mint to-teal" style={{ height: `${(w.done / Math.max(total, 1)) * 100}%` }} />
                      </span>
                      <span
                        role="tooltip"
                        className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-violet px-3 py-1.5 text-xs font-semibold text-white shadow-glow transition duration-200 ${hover === i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
                        style={{ bottom: `calc(${(total / top) * 100}% + 4px)` }}
                      >
                        {w.open} open, {w.done} done
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-3 flex">
              {items.map((w) => (
                <li key={w.owner} className="flex flex-1 flex-col items-center gap-1">
                  <Mascot role={w.owner} size={26} animate={false} />
                  <span className="w-14 truncate text-center text-[11px] text-dusk" title={w.owner}>{w.owner}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
