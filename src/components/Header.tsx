"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { IconBell, IconChevron, IconSearch } from "./icons";

interface Props {
  projects: { id: string; name: string }[];
  current: string;
  waiting: number;
  origin: "github" | "fixtures";
}

function titleFor(pathname: string, base: string): string {
  if (pathname === base) return "Overview";
  const rest = pathname.slice(base.length + 1).split("/");
  if (rest[0] === "tasks") return rest[1] ?? "Task";
  return rest[0].charAt(0).toUpperCase() + rest[0].slice(1);
}

export function Header({ projects, current, waiting, origin }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const base = `/p/${current}`;
  const onBoard = pathname === `${base}/board`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const project = projects.find((p) => p.id === current);

  // On the board the search filters live, through the URL, so the filter can be shared.
  const urlQuery = searchParams.get("q") ?? "";
  useEffect(() => {
    if (!onBoard || query.trim() === urlQuery) return;
    const t = setTimeout(() => {
      const q = query.trim();
      router.replace(q ? `${base}/board?q=${encodeURIComponent(q)}` : `${base}/board`, { scroll: false });
    }, 180);
    return () => clearTimeout(t);
  }, [query, onBoard, urlQuery, base, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const live = origin === "github";

  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-3 px-4 pb-1 pt-5 sm:gap-x-4 sm:px-8 lg:pt-7">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <div>
          <p className="text-2xl font-extrabold leading-none tracking-tight text-snow sm:text-[28px]">{titleFor(pathname, base)}</p>
          <p className="mt-1.5 hidden text-xs font-medium text-dusk lg:block">{project?.name}</p>
        </div>

        {/* Project switcher: the sidebar lists projects on desktop, so this is for phones. */}
        <div ref={menuRef} className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-xl border border-edge bg-night-3 py-1.5 pl-3 pr-2.5 text-sm font-semibold text-snow transition hover:bg-night-4"
          >
            {project?.name}
            <span className={`text-dusk transition-transform duration-300 ${open ? "rotate-180" : ""}`}><IconChevron /></span>
          </button>
          <ul
            role="listbox"
            aria-label="Projects"
            className={`absolute left-0 top-full z-40 mt-2 w-60 origin-top-left rounded-xl border border-edge bg-night-4 p-1.5 shadow-panel transition duration-200 ${
              open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            {projects.map((p) => (
              <li key={p.id} role="option" aria-selected={p.id === current}>
                <Link
                  href={`/p/${p.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold ${p.id === current ? "bg-magenta/20 text-snow" : "text-mist hover:bg-night-3 hover:text-snow"}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form
        role="search"
        className="order-last w-full sm:order-none sm:w-auto"
        onSubmit={(e) => {
          e.preventDefault();
          const q = query.trim();
          router.push(q ? `${base}/board?q=${encodeURIComponent(q)}` : `${base}/board`);
        }}
      >
        <label className="group relative block">
          <span className="sr-only">Search tasks</span>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dusk transition-colors group-focus-within:text-magenta-hi">
            <IconSearch />
          </span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            className="w-full rounded-xl border border-edge bg-night-3 py-2.5 pl-10 pr-10 text-sm font-medium text-snow transition-all duration-300 placeholder:text-dusk focus:border-magenta/60 focus:outline-none focus:ring-4 focus:ring-magenta/10 sm:w-64 sm:focus:w-80"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-edge bg-night-2 px-1.5 py-0.5 text-[11px] text-dusk sm:block">/</kbd>
        </label>
      </form>

      <span
        className="hidden items-center gap-2 rounded-xl border border-edge bg-night-3 px-3 py-2.5 text-xs font-semibold text-mist xl:flex"
        title={live ? "Reading the live repository" : "Showing a bundled snapshot"}
      >
        <span className={`h-2 w-2 rounded-full ${live ? "animate-ping bg-mint" : "bg-violet-hi"}`} />
        {live ? "Live" : "Snapshot"}
      </span>

      <Link
        href={`${base}/approvals`}
        aria-label={waiting > 0 ? `${waiting} decisions waiting` : "Approvals"}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-edge bg-night-3 text-snow transition hover:bg-night-4"
      >
        <IconBell />
        {waiting > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-bold text-white">
            {waiting}
          </span>
        )}
      </Link>
      <span className="lg:hidden"><Avatar role="You" size={44} /></span>
    </header>
  );
}
