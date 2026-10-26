"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar } from "./Avatar";
import { STATUS_STYLE } from "./StatusBadge";
import { TASK_STATUSES, type TaskStatus } from "@/lib/schema";

const ACCENT: Record<TaskStatus, string> = {
  todo: "border-l-azure",
  "in-progress": "border-l-cyan",
  review: "border-l-magenta",
  blocked: "border-l-coral",
  done: "border-l-mint",
};

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
  const query = useSearchParams().get("q") ?? "";
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
        <p className="text-xs text-dusk" aria-live="polite">
          {filtering ? `${visible.length} of ${cards.length} tasks` : `${cards.length} tasks`}
          {query.trim() !== "" && <span> matching &ldquo;{query.trim()}&rdquo;</span>}
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by agent">
          <button
            type="button"
            onClick={() => setRole(null)}
            aria-pressed={role === null}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold transition duration-300 ${role === null ? "border-magenta/50 bg-magenta/20 text-snow" : "border-edge bg-night-3 text-mist hover:bg-night-4"}`}
          >
            All agents
          </button>
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(role === r ? null : r)}
              aria-pressed={role === r}
              className={`flex items-center gap-2 rounded-lg border py-1 pl-1.5 pr-3 text-xs font-bold transition duration-300 ${role === r ? "border-magenta/50 bg-magenta/20 text-snow" : "border-edge bg-night-3 text-mist hover:bg-night-4"}`}
            >
              <Avatar role={r} size={22} />
              {r}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="panel pop p-10 text-center">
          <div className="mx-auto w-fit"><Avatar role="empty" size={56} /></div>
          <p className="mt-3 text-lg font-bold text-snow">No tasks match</p>
          <p className="mt-1 text-sm text-dusk">Clear the search box above, or pick another agent, to see the whole board.</p>
          <button
            type="button"
            onClick={() => setRole(null)}
            className="btn-primary mt-5"
          >
            Show all agents
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {TASK_STATUSES.map((status, col) => {
            const column = visible.filter((c) => c.status === status);
            const list = (
              <ul className="space-y-3">
                {column.map((c, i) => (
                  <li key={c.id} className="rise" style={{ ["--i" as string]: Math.min(i + col, 9) }}>
                    <Link
                      href={`/p/${project}/tasks/${c.id}`}
                      className={`group block rounded-xl border border-edge border-l-[3px] bg-night-3 p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-magenta/40 hover:shadow-glow ${ACCENT[c.status]}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar role={c.owner} size={30} />
                        <span className="text-sm font-bold text-snow">{c.id}</span>
                        {c.tier && <span className="ml-auto rounded-md bg-night-2 px-2 py-0.5 text-[11px] font-semibold text-dusk">Tier {c.tier}</span>}
                      </div>
                      <p className="mt-2.5 line-clamp-3 text-[13px] leading-snug text-mist transition-colors group-hover:text-snow">{c.title}</p>
                      {(c.prNumber || c.waitingOn.length > 0) && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
                          {c.prNumber && <span className="rounded-md bg-cyan/15 px-2 py-0.5 font-bold text-cyan">PR {c.prNumber}</span>}
                          {c.waitingOn.length > 0 && (
                            <span className="rounded-md bg-night-2 px-2 py-0.5 font-medium text-dusk" title={c.waitingOn.join(", ")}>
                              Waits on {c.waitingOn.slice(0, 2).join(", ")}{c.waitingOn.length > 2 ? ` +${c.waitingOn.length - 2}` : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
                {column.length === 0 && <li className="px-1 py-2 text-xs text-dusk">Nothing here.</li>}
              </ul>
            );
            return (
              <section key={status} aria-labelledby={`col-${status}`} className="min-w-0 rounded-2xl border border-edge bg-night-2/50 p-3">
                <h3 id={`col-${status}`} className="mb-3 flex items-center gap-2 px-1 text-sm font-bold text-snow">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[status].dot}`} />
                  {STATUS_STYLE[status].label}
                  <span className="ml-auto rounded-md bg-night-3 px-2 py-0.5 text-xs font-bold text-mist">{column.length}</span>
                </h3>
                {status === "done" ? (
                  <details open={filtering}>
                    <summary className="mb-3 cursor-pointer rounded-lg border border-edge bg-night-3 px-3 py-1.5 text-center text-xs font-bold text-violet-hi transition hover:bg-night-4">
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
