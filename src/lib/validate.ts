import type { Approval, Issue, Task } from "./schema";

/** Cross-file checks that the single-file parsers cannot do. */
export function validate(tasks: Task[], approvals: Approval[], boardFile = "board.md", approvalsFile = "approvals.md"): Issue[] {
  const issues: Issue[] = [];
  const seen = new Set<string>();
  for (const t of tasks) {
    if (seen.has(t.id)) {
      issues.push({ severity: "error", file: boardFile, message: `Duplicate task ID ${t.id}. IDs are never reused.` });
    }
    seen.add(t.id);
  }
  // A task may depend on an approval (e.g. "A-004"), not only on another task.
  const approvalIdSet = new Set(approvals.map((a) => a.id));
  for (const t of tasks) {
    for (const dep of t.deps) {
      if (!seen.has(dep) && !approvalIdSet.has(dep)) {
        issues.push({ severity: "error", file: boardFile, message: `${t.id} depends on ${dep}, which is not on the board.` });
      }
      if (dep === t.id) {
        issues.push({ severity: "error", file: boardFile, message: `${t.id} depends on itself.` });
      }
    }
    if (t.status === "review" && !t.pr && !t.branch) {
      issues.push({ severity: "warning", file: boardFile, message: `${t.id} is in review but has no PR link or branch.` });
    }
  }
  const approvalIds = new Set<string>();
  for (const a of approvals) {
    if (approvalIds.has(a.id)) {
      issues.push({ severity: "error", file: approvalsFile, message: `Duplicate approval ID ${a.id}.` });
    }
    approvalIds.add(a.id);
  }
  return issues;
}

/** Whether a dependency is met: a task that is `done`, or an approval that is `approved`. */
export function dependencyMet(dep: string, tasks: Task[], approvals: Approval[]): boolean {
  const task = tasks.find((t) => t.id === dep);
  if (task) return task.status === "done";
  const approval = approvals.find((a) => a.id === dep);
  return approval?.status === "approved";
}

/** Tasks still `todo` whose dependencies are all met. */
export function readyTasks(tasks: Task[], approvals: Approval[] = []): Task[] {
  return tasks.filter((t) => t.status === "todo" && t.deps.every((d) => dependencyMet(d, tasks, approvals)));
}
