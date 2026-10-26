"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RoleSeal } from "./RoleSeal";
import { STATUS_STYLE } from "./StatusBadge";
import { TASK_STATUSES, type TaskStatus } from "@/lib/schema";

export interface BoardCard {
  id: string;
  title: string;
  owner: string;
  status: TaskStatus;
  session: string;
  prNumber?: number;
  tier?: string;
  /** Dependencies that are not met yet. */
  waitingOn: string[];
}

export function BoardView({ project, cards }: { project: string; cards: BoardCard[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const roles = useMemo(() => [...new Set(cards.map((c) => c.owner))].sort(), [cards]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (!role || c.owner === role) &&
        (!q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.session.toLowerCase().includes(q)),
    );
  }, [cards, query, role]);
  const filtering = query.trim() !== "" || role !== null;

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="block w-full max-w-xs">
            <span className="sr-only">Search tasks</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks"
              className="w-full rounded-md border border-line bg-ink-2 px-3 py-2 text-sm text-marble placeholder:text-ash focus:border-bronze focus:outline-none"
            />
          </label>
          <p className="shrink-0 text-xs text-ash" aria-live="polite">
            {filtering ? `${visible.length} of ${cards.length} tasks` : `${cards.length} tasks`}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by role">
          <button
            type="button"
            onClick={() => setRole(null)}
            aria-pressed={role === null}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${role === null ? "border-bronze bg-bronze/15 text-bronze-hi" : "border-line text-stone hover:text-marble"}`}
          >
            All roles
          </button>
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(role === r ? null : r)}
              aria-pressed={role === r}
              className={`flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-3 text-xs font-medium ${role === r ? "border-bronze bg-bronze/15 text-bronze-hi" : "border-line text-stone hover:text-marble"}`}
            >
              <RoleSeal role={r} size={22} />
              {r}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-marble">No tasks match.</p>
          <p className="mt-1 text-sm text-ash">Clear the search or pick another role to see the whole board.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setRole(null); }}
            className="mt-4 rounded-md bg-bronze px-4 py-2 text-sm font-semibold text-ink hover:bg-bronze-hi"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {TASK_STATUSES.map((status) => {
            const column = visible.filter((c) => c.status === status);
            const list = (
              <ul className="space-y-2">
                {column.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/p/${project}/tasks/${c.id}`}
                      className="group block rounded-lg border border-line bg-ink-2 p-3 hover:border-bronze/60 hover:bg-ink-3"
                    >
                      <div className="flex items-center gap-2">
                        <RoleSeal role={c.owner} size={24} />
                        <span className="text-sm font-semibold text-bronze">{c.id}</span>
                        {c.tier && <span className="ml-auto text-xs text-ash">Tier {c.tier}</span>}
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm leading-snug text-marble">{c.title}</p>
                      {(c.prNumber || c.waitingOn.length > 0) && (
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                          {c.prNumber && <span className="text-bronze-hi">PR {c.prNumber}</span>}
                          {c.waitingOn.length > 0 && (
                            <span className="text-ash" title={c.waitingOn.join(", ")}>
                              Waits on {c.waitingOn.slice(0, 2).join(", ")}{c.waitingOn.length > 2 ? ` +${c.waitingOn.length - 2}` : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
                {column.length === 0 && <li className="px-1 text-xs text-ash">Nothing here.</li>}
              </ul>
            );
            return (
              <section key={status} aria-labelledby={`col-${status}`} className="min-w-0">
                <h2 id={`col-${status}`} className="mb-3 flex items-center gap-2 font-sans text-sm font-semibold text-marble">
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STATUS_STYLE[status].dot}`} />
                  {STATUS_STYLE[status].label}
                  <span className="font-normal text-ash">{column.length}</span>
                </h2>
                {status === "done" ? (
                  <details open={filtering}>
                    <summary className="mb-2 cursor-pointer text-xs text-bronze-hi">
                      {column.length} finished, show
                    </summary>
                    {list}
                  </details>
                ) : (
                  list
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
