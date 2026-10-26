import type { Approval, Task, TaskStatus, Usage } from "./schema";
import { TASK_STATUSES } from "./schema";
import { readyTasks } from "./validate";

export interface Workload {
  owner: string;
  open: number;
  inProgress: number;
  done: number;
  total: number;
  byStatus: Record<TaskStatus, number>;
}

export interface ApprovalTally {
  pending: number;
  decided: number;
  total: number;
}

export interface Spend {
  usd: number;
  basis: "per-task" | "reported total";
}

export interface Overview {
  total: number;
  byStatus: Record<TaskStatus, number>;
  /** Share of tasks that are done, 0 to 100, rounded. */
  percentDone: number;
  pendingApprovals: Approval[];
  inReview: Task[];
  blocked: Task[];
  ready: Task[];
  workload: Workload[];
  spend: Spend | null;
  approvalTally: ApprovalTally;
}

export function overview(tasks: Task[], approvals: Approval[], usage: Usage): Overview {
  const byStatus = Object.fromEntries(TASK_STATUSES.map((s) => [s, 0])) as Record<TaskStatus, number>;
  for (const t of tasks) byStatus[t.status]++;

  const owners = new Map<string, Workload>();
  for (const t of tasks) {
    const w =
      owners.get(t.owner) ??
      {
        owner: t.owner,
        open: 0,
        inProgress: 0,
        done: 0,
        total: 0,
        byStatus: Object.fromEntries(TASK_STATUSES.map((st) => [st, 0])) as Record<TaskStatus, number>,
      };
    w.total++;
    w.byStatus[t.status]++;
    if (t.status === "done") w.done++;
    else w.open++;
    if (t.status === "in-progress") w.inProgress++;
    owners.set(t.owner, w);
  }

  const perTaskTotal = usage.perTask.reduce((sum, r) => sum + (r.usd ?? 0), 0);
  let spend: Spend | null = null;
  if (usage.perTask.some((r) => r.usd !== null)) {
    spend = { usd: perTaskTotal, basis: "per-task" };
  } else {
    const first = usage.totals.find((t) => t.usd !== null);
    if (first && first.usd !== null) spend = { usd: first.usd, basis: "reported total" };
  }

  return {
    total: tasks.length,
    byStatus,
    percentDone: tasks.length === 0 ? 0 : Math.round((byStatus.done / tasks.length) * 100),
    pendingApprovals: approvals.filter((a) => a.status === "pending"),
    inReview: tasks.filter((t) => t.status === "review"),
    blocked: tasks.filter((t) => t.status === "blocked"),
    ready: readyTasks(tasks, approvals),
    workload: [...owners.values()].sort((a, b) => b.open - a.open || a.owner.localeCompare(b.owner)),
    spend,
    approvalTally: {
      pending: approvals.filter((a) => a.status === "pending").length,
      decided: approvals.filter((a) => a.status !== "pending").length,
      total: approvals.length,
    },
  };
}
