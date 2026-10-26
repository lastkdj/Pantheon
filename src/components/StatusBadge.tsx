import type { ApprovalStatus, TaskStatus } from "@/lib/schema";

const styles: Record<TaskStatus | ApprovalStatus, string> = {
  todo: "border-gunmetal-grey text-slate-grey",
  "in-progress": "border-aethelred-gold text-aethelred-gold",
  review: "border-void-gold-light text-void-gold-light bg-aethelred-gold/10",
  blocked: "border-destruction text-destruction",
  done: "border-success text-success",
  pending: "border-aethelred-gold text-aethelred-gold bg-aethelred-gold/10",
  approved: "border-success text-success",
  rejected: "border-destruction text-destruction",
  deferred: "border-muted-grey text-muted-grey",
};

export function StatusBadge({ status }: { status: TaskStatus | ApprovalStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}
