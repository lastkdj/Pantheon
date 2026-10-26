import type { TaskStatus } from "@/lib/schema";

const STEPS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "in-progress", label: "In progress" },
  { status: "review", label: "In review" },
  { status: "done", label: "Done" },
];

/** Where a task is on its way to done. Blocked tasks show their own state instead. */
export function Stepper({ status }: { status: TaskStatus }) {
  if (status === "blocked") {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-oxblood" role="status">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-oxblood" />
        Blocked. See the notes below for what it is waiting on.
      </p>
    );
  }
  const current = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="flex items-center" aria-label="Progress">
      {STEPS.map((s, i) => {
        const reached = i <= current;
        return (
          <li key={s.status} className="flex flex-1 items-center last:flex-none" aria-current={i === current ? "step" : undefined}>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full border-2 ${
                  reached ? "border-bronze bg-bronze" : "border-line bg-ink"
                } ${i === current ? "ring-4 ring-bronze/20" : ""}`}
              />
              <span className={`text-sm ${i === current ? "font-semibold text-marble" : reached ? "text-stone" : "text-ash"}`}>
                {s.label}
              </span>
            </span>
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className={`mx-3 h-px flex-1 ${i < current ? "bg-bronze" : "bg-line"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
