"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "./Avatar";
import { IconArrowRight, IconBoard, IconOverview, IconPulse, IconShield, IconWallet } from "./icons";

interface Props {
  projects: { id: string; name: string }[];
  current: string;
  counts: { waiting: number; errors: number; ready: number };
}

const STRIDE = 48; // item height 44 + gap 4

function Logo() {
  return (
    <Link href="/" aria-label="Pantheon home" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C03CFF] via-azure to-cyan shadow-glow-blue">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M3 9 12 3.5 21 9z" />
          <rect x="5" y="11" width="3" height="8" rx="1.2" />
          <rect x="10.5" y="11" width="3" height="8" rx="1.2" />
          <rect x="16" y="11" width="3" height="8" rx="1.2" />
          <rect x="3.5" y="20" width="17" height="2" rx="1" />
        </svg>
      </span>
      <span>
        <span className="block text-lg font-extrabold leading-none tracking-tight text-snow">Pantheon</span>
        <span className="mt-1 block text-[11px] font-medium text-dusk">Agent control room</span>
      </span>
    </Link>
  );
}

export function Sidebar({ projects, current, counts }: Props) {
  const pathname = usePathname();
  const base = `/p/${current}`;
  const items = [
    { href: base, label: "Overview", icon: <IconOverview />, exact: true, badge: 0 },
    { href: `${base}/board`, label: "Board", icon: <IconBoard />, badge: 0 },
    { href: `${base}/approvals`, label: "Approvals", icon: <IconShield />, badge: counts.waiting },
    { href: `${base}/costs`, label: "Costs", icon: <IconWallet />, badge: 0 },
    { href: `${base}/health`, label: "Health", icon: <IconPulse />, badge: counts.errors, danger: true },
  ];
  const found = items.findIndex((it) => (it.exact ? pathname === it.href : pathname.startsWith(it.href)));
  const activeIndex = pathname.startsWith(`${base}/tasks`) ? 1 : Math.max(found, 0);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col overflow-y-auto border-r border-edge bg-night-2/60 px-5 py-6 backdrop-blur lg:flex">
        <Logo />

        <p className="label mb-2 mt-9 px-3">Menu</p>
        <nav aria-label="Sections" className="relative">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-11 rounded-xl border-l-[3px] border-magenta bg-gradient-to-r from-magenta/20 to-transparent transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ transform: `translateY(${activeIndex * STRIDE}px)` }}
          />
          <ul className="relative space-y-1">
            {items.map((it, i) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={i === activeIndex ? "page" : undefined}
                  className={`flex h-11 items-center gap-3.5 rounded-xl px-4 text-sm font-semibold transition-colors duration-300 ${
                    i === activeIndex ? "text-snow" : "text-mist hover:text-snow"
                  }`}
                >
                  <span className={`transition-colors duration-300 ${i === activeIndex ? "text-magenta-hi" : "text-dusk"}`}>{it.icon}</span>
                  {it.label}
                  {it.badge > 0 && (
                    <span className={`ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-bold ${it.danger ? "bg-coral/20 text-coral" : "bg-magenta/20 text-magenta-hi"}`}>
                      {it.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="label mb-2 mt-8 px-3">Projects</p>
        <nav aria-label="Projects">
          <ul className="space-y-1">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/p/${p.id}`}
                  aria-current={p.id === current ? "true" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    p.id === current ? "bg-night-4 text-snow" : "text-mist hover:bg-night-3 hover:text-snow"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${p.id === current ? "bg-cyan" : "bg-dusk/50"}`} />
                  <span className="truncate">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto space-y-4 pt-8">
          <div className="flex items-center gap-3 rounded-xl px-1">
            <Avatar role="You" size={38} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-snow">You</p>
              <p className="truncate text-xs text-dusk">Owner, approves the work</p>
            </div>
          </div>
          <Link href={`${base}/health`} className="btn-primary w-full justify-between">
            {counts.ready > 0 ? `${counts.ready} ready to start` : "Nothing ready yet"}
            <IconArrowRight />
          </Link>
        </div>
      </aside>

      {/* Phone tab bar */}
      <nav aria-label="Sections" className="fixed inset-x-3 bottom-3 z-30 rounded-2xl border border-edge bg-night-3/95 p-1.5 shadow-panel backdrop-blur lg:hidden">
        <div className="relative grid grid-cols-5">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/5 p-0.5 transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          >
            <span className="block h-full rounded-xl bg-gradient-to-br from-magenta/30 to-violet/20 ring-1 ring-magenta/40" />
          </span>
          {items.map((it, i) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={i === activeIndex ? "page" : undefined}
              className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${i === activeIndex ? "text-snow" : "text-dusk"}`}
            >
              <span className="relative">
                {it.icon}
                {it.badge > 0 && (
                  <span className={`absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${it.danger ? "bg-coral" : "bg-magenta"}`}>
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
