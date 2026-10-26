import type { ApprovalStatus, TaskStatus } from "@/lib/schema";

/** One hue per status, used here, in the progress bar and on the board. */
export const STATUS_STYLE: Record<TaskStatus | ApprovalStatus, { text: string; dot: string; label: string }> = {
  todo: { text: "text-stone", dot: "bg-stone/70", label: "To do" },
  "in-progress": { text: "text-lapis", dot: "bg-lapis", label: "In progress" },
  review: { text: "text-bronze-hi", dot: "bg-bronze", label: "In review" },
  blocked: { text: "text-oxblood", dot: "bg-oxblood", label: "Blocked" },
  done: { text: "text-verdigris", dot: "bg-verdigris", label: "Done" },
  pending: { text: "text-bronze-hi", dot: "bg-bronze", label: "Waiting" },
  approved: { text: "text-verdigris", dot: "bg-verdigris", label: "Approved" },
  rejected: { text: "text-oxblood", dot: "bg-oxblood", label: "Rejected" },
  deferred: { text: "text-ash", dot: "bg-ash", label: "Deferred" },
};

export function StatusBadge({ status }: { status: TaskStatus | ApprovalStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
