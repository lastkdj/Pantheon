import type { TaskStatus } from "@/lib/schema";
import { TASK_STATUSES } from "@/lib/schema";
import { STATUS_STYLE } from "./StatusBadge";

/** Segmented bar of task statuses. Grows in once on load. */
export function StatusBar({ counts, total }: { counts: Record<TaskStatus, number>; total: number }) {
  return (
    <div>
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-ink-3"
        role="img"
        aria-label={TASK_STATUSES.map((s) => `${counts[s]} ${STATUS_STYLE[s].label.toLowerCase()}`).join(", ")}
      >
        {TASK_STATUSES.filter((s) => counts[s] > 0).map((s) => (
          <div
            key={s}
            className={`${STATUS_STYLE[s].dot} origin-left animate-grow`}
            style={{ width: `${(counts[s] / Math.max(total, 1)) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {TASK_STATUSES.map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLE[s].dot}`} />
            <span className="text-stone">{STATUS_STYLE[s].label}</span>
            <span className="font-medium text-marble">{counts[s]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
