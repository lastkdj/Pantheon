"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  projects: { id: string; name: string }[];
  current: string;
  errorCount: number;
}

export function Nav({ projects, current, errorCount }: Props) {
  const pathname = usePathname();
  const base = `/p/${current}`;
  const links = [
    { href: base, label: "Board" },
    { href: `${base}/approvals`, label: "Approvals" },
    { href: `${base}/costs`, label: "Costs" },
    { href: `${base}/health`, label: errorCount > 0 ? `Health (${errorCount})` : "Health" },
  ];
  return (
    <header className="border-b border-gunmetal-grey bg-void-navy">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-cinzel text-lg font-bold tracking-[0.2em] text-aethelred-gold">
            PANTHEON
          </Link>
          <nav aria-label="Projects" className="flex gap-1">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/p/${p.id}`}
                aria-current={p.id === current ? "true" : undefined}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  p.id === current ? "bg-gunmetal-grey text-void-gold-light" : "text-muted-grey hover:text-void-gold-light"
                }`}
              >
                {p.name}
              </Link>
            ))}
          </nav>
        </div>
        <nav aria-label="Sections" className="flex gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = l.href === base ? pathname === base || pathname.startsWith(`${base}/tasks`) : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                  active ? "bg-aethelred-gold text-void-black" : "text-slate-grey hover:text-void-gold-light"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
