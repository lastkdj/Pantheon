/** Schema v1. The markdown format is the contract; these are the typed results. */
export const SCHEMA_VERSION = 1;

export const TASK_STATUSES = ["todo", "in-progress", "review", "blocked", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** `deferred` appears in MyGold's approvals.md (A-011) although its README lists only the first three. */
export const APPROVAL_STATUSES = ["pending", "approved", "rejected", "deferred"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export interface PullRequestRef {
  url: string;
  number: number;
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  status: TaskStatus;
  deps: string[];
  output: string;
  notes: string;
  /** Explicit "Session" column when the board has one. */
  session?: string;
  /** Explicit "Tier" column (A, B or C) when the board has one. */
  tier?: string;
  branch?: string;
  pr?: PullRequestRef;
}

export interface Approval {
  id: string;
  agent: string;
  action: string;
  prepared: string;
  risk: string;
  status: ApprovalStatus;
  /** Anything after the status word, e.g. "(owner, 2026-10-24)". */
  statusNote: string;
}

export interface UsageTotal {
  label: string;
  costText: string;
  /** First dollar amount found in the cost cell, if any. */
  usd: number | null;
  notes: string;
}

export interface UsageTask {
  task: string;
  session: string;
  model: string;
  tokens: number | null;
  usd: number | null;
  date: string;
}

export interface Usage {
  totals: UsageTotal[];
  perTask: UsageTask[];
}

export type IssueSeverity = "error" | "warning";

export interface Issue {
  severity: IssueSeverity;
  file: string;
  line?: number;
  message: string;
}

export interface ProjectState {
  tasks: Task[];
  approvals: Approval[];
  usage: Usage;
  issues: Issue[];
}
