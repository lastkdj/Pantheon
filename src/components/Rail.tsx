"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowRight, IconBoard, IconOverview, IconPulse, IconShield, IconWallet } from "./icons";

interface Props {
  current: string;
  counts: { waiting: number; errors: number; review: number };
}

const STRIDE = 56; // item height 48 + gap 8

export function Rail({ current, counts }: Props) {
  const pathname = usePathname();
  const base = `/p/${current}`;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      setExpanded(localStorage.getItem("pantheon.rail") === "open");
    } catch {
      /* storage blocked: stay collapsed */
    }
  }, []);

  function toggle() {
    setExpanded((v) => {
      try {
        localStorage.setItem("pantheon.rail", v ? "closed" : "open");
      } catch {
        /* ignore */
      }
      return !v;
    });
  }

  const items = [
    { href: base, label: "Overview", icon: <IconOverview />, exact: true, badge: 0 },
    { href: `${base}/board`, label: "Board", icon: <IconBoard />, badge: 0 },
    { href: `${base}/approvals`, label: "Approvals", icon: <IconShield />, badge: counts.waiting },
    { href: `${base}/costs`, label: "Costs", icon: <IconWallet />, badge: 0 },
    { href: `${base}/health`, label: "Health", icon: <IconPulse />, badge: counts.errors },
  ];
  const active = Math.max(
    0,
    items.findIndex((it) => (it.exact ? pathname === it.href : pathname.startsWith(it.href))),
  );
  // Task pages belong to the Board.
  const activeIndex = pathname.startsWith(`${base}/tasks`) ? 1 : active;

  return (
    <>
      {/* Desktop rail */}
      <aside
        className="relative m-4 hidden shrink-0 flex-col rounded-[28px] bg-night-3 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] lg:flex"
        style={{ width: expanded ? 220 : 76 }}
      >
        <Link href="/" aria-label="Pantheon home" className="mx-auto mb-7 flex items-center gap-3 px-3 self-stretch">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6AEBFF] via-azure to-violet shadow-glow-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M3 9 12 3.5 21 9z" />
              <rect x="5" y="11" width="3" height="8" rx="1.2" />
              <rect x="10.5" y="11" width="3" height="8" rx="1.2" />
              <rect x="16" y="11" width="3" height="8" rx="1.2" />
              <rect x="3.5" y="20" width="17" height="2" rx="1" />
            </svg>
          </span>
          <span
            className={`font-display text-lg font-semibold tracking-wide text-snow transition-opacity duration-300 ${expanded ? "opacity-100" : "pointer-events-none w-0 opacity-0"}`}
          >
            Pantheon
          </span>
        </Link>

        <nav aria-label="Sections" className="relative px-3">
          <span
            aria-hidden="true"
            className="absolute inset-x-3 top-0 h-12 rounded-2xl bg-violet shadow-glow transition-transform duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]"
            style={{ transform: `translateY(${activeIndex * STRIDE}px)` }}
          />
          <ul className="relative space-y-2">
            {items.map((it, i) => (
              <li key={it.href} className="group relative">
                <Link
                  href={it.href}
                  aria-current={i === activeIndex ? "page" : undefined}
                  className={`flex h-12 items-center gap-4 rounded-2xl px-[13px] transition-colors duration-300 ${
                    i === activeIndex ? "text-white" : "text-dusk hover:text-snow"
                  }`}
                >
                  <span className="relative shrink-0">
                    {it.icon}
                    {it.badge > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                        {it.badge}
                      </span>
                    )}
                  </span>
                  <span className={`whitespace-nowrap text-sm font-medium transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}>
                    {it.label}
                  </span>
                </Link>
                {!expanded && (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-night px-2.5 py-1.5 text-xs font-medium text-snow opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    {it.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={toggle}
          aria-label={expanded ? "Collapse the menu" : "Expand the menu"}
          aria-expanded={expanded}
          className="mx-auto mt-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white shadow-glow-pink transition duration-300 hover:scale-105 active:scale-95"
        >
          <span className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}>
            <IconArrowRight />
          </span>
        </button>
      </aside>

      {/* Phone tab bar */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-3 bottom-3 z-30 rounded-[26px] bg-night-3/95 p-1.5 shadow-frame backdrop-blur lg:hidden"
      >
        <div className="relative grid grid-cols-5">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/5 p-0.5 transition-transform duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          >
            <span className="block h-full rounded-[20px] bg-violet shadow-glow" />
          </span>
          {items.map((it, i) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={i === activeIndex ? "page" : undefined}
              className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                i === activeIndex ? "text-white" : "text-dusk"
              }`}
            >
              <span className="relative">
                {it.icon}
                {it.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                    {it.badge}
                  </span>
                )}
              </span>
              {it.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
