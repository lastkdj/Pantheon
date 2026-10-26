"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  projects: { id: string; name: string }[];
  current: string;
  counts: { waiting: number; errors: number; review: number };
  origin: "github" | "fixtures";
}

export function SideNav({ projects, current, counts, origin }: Props) {
  const pathname = usePathname();
  const base = `/p/${current}`;
  const items = [
    { href: base, label: "Overview", exact: true, badge: 0 },
    { href: `${base}/board`, label: "Board", badge: counts.review, badgeLabel: "in review" },
    { href: `${base}/approvals`, label: "Approvals", badge: counts.waiting, badgeLabel: "waiting" },
    { href: `${base}/costs`, label: "Costs", badge: 0 },
    { href: `${base}/health`, label: "Health", badge: counts.errors, badgeLabel: "errors", danger: true },
  ];

  return (
    <aside className="border-b border-line bg-ink-2 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:block lg:px-5 lg:py-6">
        <Link href="/" className="font-cinzel text-xl font-bold tracking-[0.22em] text-bronze">
          PANTHEON
        </Link>
        <p className="hidden text-xs text-ash lg:mt-1 lg:block">Agent control room</p>
      </div>

      <nav aria-label="Projects" className="flex gap-1 overflow-x-auto px-3 pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        <p className="label hidden px-2 pb-1 lg:block">Projects</p>
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/p/${p.id}`}
            aria-current={p.id === current ? "true" : undefined}
            className={`rounded-md px-2.5 py-1.5 text-sm lg:whitespace-normal whitespace-nowrap ${
              p.id === current ? "bg-ink-3 font-medium text-marble" : "text-ash hover:text-marble"
            }`}
          >
            {p.name}
          </Link>
        ))}
      </nav>

      <nav aria-label="Sections" className="flex gap-0.5 overflow-x-auto px-2 py-2 lg:mt-5 lg:flex-col lg:overflow-visible lg:px-3 lg:py-0">
        {items.map((it) => {
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-md px-2 py-2 text-sm lg:gap-3 lg:px-2.5 ${
                active ? "bg-bronze/15 font-medium text-bronze-hi" : "text-stone hover:bg-ink-3 hover:text-marble"
              }`}
            >
              {it.label}
              {it.badge > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs font-semibold ${it.danger ? "bg-oxblood/20 text-oxblood" : "bg-bronze/20 text-bronze-hi"}`}
                  title={`${it.badge} ${it.badgeLabel}`}
                >
                  {it.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <p className="mt-auto hidden px-5 py-5 text-xs text-ash lg:block">
        <span
          aria-hidden="true"
          className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${origin === "github" ? "bg-verdigris" : "bg-bronze"}`}
        />
        {origin === "github" ? "Live from GitHub" : "Showing a snapshot"}
      </p>
    </aside>
  );
}
