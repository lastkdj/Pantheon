import type { ApprovalStatus, TaskStatus } from "@/lib/schema";

/** One hue per status, used here, in the progress bar and on the board. */
export const STATUS_STYLE: Record<TaskStatus | ApprovalStatus, { text: string; dot: string; label: string }> = {
  todo: { text: "text-azure-hi", dot: "bg-azure", label: "To do" },
  "in-progress": { text: "text-cyan", dot: "bg-cyan", label: "In progress" },
  review: { text: "text-magenta-hi", dot: "bg-magenta", label: "In review" },
  blocked: { text: "text-coral", dot: "bg-coral", label: "Blocked" },
  done: { text: "text-mint", dot: "bg-mint", label: "Done" },
  pending: { text: "text-magenta-hi", dot: "bg-magenta", label: "Waiting" },
  approved: { text: "text-mint", dot: "bg-mint", label: "Approved" },
  rejected: { text: "text-coral", dot: "bg-coral", label: "Rejected" },
  deferred: { text: "text-dusk", dot: "bg-dusk", label: "Deferred" },
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
