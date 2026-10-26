import type { ApprovalStatus, TaskStatus } from "@/lib/schema";

/** One hue per status, used here, in the progress bar and on the board. */
export const STATUS_STYLE: Record<TaskStatus | ApprovalStatus, { text: string; dot: string; label: string }> = {
  todo: { text: "text-mist", dot: "bg-mist/70", label: "To do" },
  "in-progress": { text: "text-azure-hi", dot: "bg-azure-hi", label: "In progress" },
  review: { text: "text-violet-hi", dot: "bg-violet", label: "In review" },
  blocked: { text: "text-coral", dot: "bg-coral", label: "Blocked" },
  done: { text: "text-mint", dot: "bg-mint", label: "Done" },
  pending: { text: "text-violet-hi", dot: "bg-violet", label: "Waiting" },
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
