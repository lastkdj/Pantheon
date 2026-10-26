"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "./icons";
import { Mascot } from "./Mascot";

export interface NeedItem {
  key: string;
  kind: "decision" | "review" | "blocked";
  id: string;
  title: string;
  role: string;
  /** Small line at the bottom: risk level, PR number, etc. */
  meta: string;
  href: string;
}

const KIND_LABEL = { decision: "Decision", review: "Review", blocked: "Blocked" } as const;
const KIND_TAG = {
  decision: "bg-coral/15 text-coral",
  review: "bg-azure/25 text-azure-hi",
  blocked: "bg-coral/15 text-coral",
} as const;

export function NeedsCarousel({ items }: { items: NeedItem[] }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-snow">Needs you</h3>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => {
            const disabled = dir === -1 ? edge.start : edge.end;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                disabled={disabled}
                aria-label={dir === -1 ? "Scroll back" : "Scroll forward"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-night-3 text-violet-hi transition duration-300 enabled:hover:bg-violet enabled:hover:text-white enabled:active:scale-90 disabled:opacity-30"
              >
                {dir === -1 ? <IconArrowLeft /> : <IconArrowRight />}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={scroller}
        className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-5 pt-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <Link
              key={it.key}
              href={it.href}
              role="listitem"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{ ["--i" as string]: Math.min(i, 8) }}
              className={`pop relative flex min-h-[13.5rem] w-44 shrink-0 snap-start flex-col rounded-[26px] px-4 pb-4 pt-14 transition-all duration-500 ease-[cubic-bezier(.2,.9,.2,1)] sm:w-48 ${
                on ? "-translate-y-3 scale-[1.04] bg-violet shadow-glow" : "bg-night-3 ring-1 ring-edge"
              }`}
            >
              <span
                className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[56%] transition-transform duration-500 ease-[cubic-bezier(.3,1.4,.5,1)] ${on ? "scale-[1.1]" : "scale-100"}`}
              >
                <Mascot role={it.role} size={74} animate={on} />
              </span>
              <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${on ? "bg-white/20 text-white" : KIND_TAG[it.kind]}`}>
                {KIND_LABEL[it.kind]}
              </span>
              <span className={`mt-2.5 font-display text-base font-semibold ${on ? "text-white" : "text-snow"}`}>{it.id}</span>
              <span className={`mt-1 line-clamp-3 text-[13px] leading-snug transition-colors ${on ? "text-white/85" : "text-mist"}`}>{it.title}</span>
              <span className={`mt-auto pt-3 text-sm font-semibold ${on ? "text-white" : "text-violet-hi"}`}>{it.meta}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
