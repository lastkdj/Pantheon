"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const base = `/p/${current}`;
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const onBoard = pathname === `${base}/board`;
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

  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-3 px-4 pb-2 pt-5 sm:gap-x-4 sm:px-8 lg:pt-7">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
      <p className="font-display text-2xl font-semibold text-snow sm:text-[28px]">{titleFor(pathname, base)}</p>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full bg-night-3 py-1.5 pl-3 pr-2.5 text-sm font-medium text-snow transition hover:bg-night-4"
        >
          <span className={`h-2 w-2 rounded-full ${origin === "github" ? "bg-mint" : "bg-violet-hi"}`} title={origin === "github" ? "Live from GitHub" : "Showing a snapshot"} />
          {project?.name}
          <span className={`text-dusk transition-transform duration-300 ${open ? "rotate-180" : ""}`}><IconChevron /></span>
        </button>
        <ul
          role="listbox"
          aria-label="Projects"
          className={`absolute left-0 top-full z-40 mt-2 w-60 origin-top-left rounded-2xl bg-night-3 p-1.5 shadow-frame ring-1 ring-edge transition duration-200 ${
            open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          {projects.map((p) => (
            <li key={p.id} role="option" aria-selected={p.id === current}>
              <Link
                href={`/p/${p.id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm ${p.id === current ? "bg-violet text-white" : "text-mist hover:bg-night-4 hover:text-snow"}`}
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
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dusk transition-colors group-focus-within:text-violet-hi">
            <IconSearch />
          </span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            className="w-full rounded-full bg-night-3 py-2.5 pl-11 pr-12 text-sm text-snow placeholder:text-dusk ring-1 ring-transparent transition-all duration-300 focus:outline-none focus:ring-violet sm:w-64 sm:focus:w-80"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md bg-night-2 px-1.5 py-0.5 text-[11px] text-dusk sm:block">/</kbd>
        </label>
      </form>

      <Link
        href={`${base}/approvals`}
        aria-label={waiting > 0 ? `${waiting} decisions waiting` : "Approvals"}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-night-3 text-snow transition hover:bg-night-4"
      >
        <IconBell />
        {waiting > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {waiting}
          </span>
        )}
      </Link>
      <span
        title="You"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet to-azure font-display text-sm font-semibold text-white shadow-glow"
      >
        You
      </span>
    </header>
  );
}
