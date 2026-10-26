import type { ProjectConfig } from "./config";
import type { Task } from "./schema";
import { branchName, sessionName } from "./naming";

/**
 * The text you paste into a fresh session to start a task.
 * Built only from the board row, so it stays short and costs nothing to produce.
 */
export function buildBrief(project: ProjectConfig, task: Task, all: Task[]): string {
  const byId = new Map(all.map((t) => [t.id, t]));
  const deps = task.deps.map((d) => `${d} (${byId.get(d)?.status ?? "missing"})`).join(", ") || "none";
  const lines = [
    `Session name: ${sessionName(project, task)}`,
    `Task: ${task.id} · ${task.title}`,
    `Owner role: ${task.owner}`,
    `Tier: ${task.tier ?? "decide from the change (A docs, B small code, C money/auth/data)"}`,
    `Branch: ${branchName(project, task)} (from the default dev branch; open a PR, never push to dev or main)`,
    `Depends on: ${deps}`,
    `Output or contract: ${task.output || "none stated"}`,
    "",
    "Notes from the board:",
    task.notes || "(none)",
    "",
    project.rulesPath
      ? `Read ${project.rulesPath} first, then only the contract sections this task needs.`
      : "Read the project rules first, then only the contract sections this task needs.",
    "When done: push the branch, open the PR, set the board row to `review`, and stop. Do not mark your own work `done`.",
  ];
  return lines.join("\n");
}
