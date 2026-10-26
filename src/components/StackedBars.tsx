"use client";

import { useState } from "react";
import type { Workload } from "@/lib/stats";
import { STACK } from "@/lib/stack";
import { TASK_STATUSES } from "@/lib/schema";

const H = 240; // plot height in px

export function StackedBars({ items }: { items: Workload[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...items.map((w) => w.total), 1);
  const step = max <= 8 ? 2 : max <= 20 ? 5 : 10;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = top; v >= 0; v -= step) ticks.push(v);

  return (
    <div>
      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-mist">
        {["todo", "in-progress", "review", "done", "blocked"].map((st) => STACK.find((x) => x.status === st)!).map((s) => (
          <li key={s.status} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
            {s.label}
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <div className="relative w-7 shrink-0 text-right text-[11px] text-dusk" style={{ height: H }} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: ((top - t) / top) * H }}>{t}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:thin]">
          <div className="relative" style={{ minWidth: items.length * 40 }}>
            <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: H }} aria-hidden="true">
              {ticks.map((t) => (
                <div key={t} className="absolute inset-x-0 border-t border-dashed border-white/[0.07]" style={{ top: ((top - t) / top) * H }} />
              ))}
            </div>
            <ul className="relative flex items-end" style={{ height: H }}>
              {items.map((w, i) => (
                <li key={w.owner} className="relative flex h-full flex-1 items-end justify-center">
                  <button
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    aria-label={`${w.owner}: ${STACK.map((s) => `${w.byStatus[s.status]} ${s.label.toLowerCase()}`).join(", ")}`}
                    className="relative flex h-full w-4 items-end justify-center rounded-t-md sm:w-5"
                  >
                    <span
                      className={`flex w-full origin-bottom animate-growY flex-col-reverse overflow-hidden rounded-t-full transition-opacity duration-300 ${hover !== null && hover !== i ? "opacity-30" : "opacity-100"}`}
                      style={{ height: (w.total / top) * H, animationDelay: `${i * 55}ms` }}
                    >
                      {STACK.map((s) =>
                        w.byStatus[s.status] > 0 ? (
                          <span
                            key={s.status}
                            style={{ height: `${(w.byStatus[s.status] / w.total) * 100}%`, background: `linear-gradient(180deg, ${s.from}, ${s.to})` }}
                          />
                        ) : null,
                      )}
                    </span>
                    <span
                      role="tooltip"
                      className={`pointer-events-none absolute left-1/2 z-10 w-max -translate-x-1/2 rounded-xl border border-edge bg-night-4 px-3 py-2 text-left text-xs shadow-panel transition duration-200 ${hover === i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
                      style={{ bottom: `calc(${(w.total / top) * 100}% + 8px)` }}
                    >
                      <span className="block font-bold text-snow">{w.owner}</span>
                      {TASK_STATUSES.filter((st) => w.byStatus[st] > 0).map((st) => (
                        <span key={st} className="block text-mist">
                          {w.byStatus[st]} {STACK.find((x) => x.status === st)!.label.toLowerCase()}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <ul className="flex h-24" aria-hidden="true">
              {items.map((w) => (
                <li key={w.owner} className="relative flex-1">
                  <span className="absolute right-1/2 top-3 origin-top-right translate-x-1.5 -rotate-45 whitespace-nowrap text-[11px] text-dusk">{w.owner}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
