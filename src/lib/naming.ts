import type { ProjectConfig } from "./config";
import type { Task } from "./schema";

export function slugify(text: string, maxWords = 4, maxLen = 32): string {
  const words = text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, maxWords);
  return words.join("-").slice(0, maxLen).replace(/-+$/, "");
}

/** Prefer the slug already used in the task's branch, otherwise derive it from the title. */
export function slugFor(task: Task): string {
  if (task.branch) {
    const last = task.branch.split("/").pop() ?? "";
    const rest = last.replace(new RegExp(`^${task.id}-?`, "i"), "");
    if (rest) return rest;
  }
  return slugify(task.title);
}

function fill(pattern: string, values: Record<string, string>): string {
  return pattern.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

export function sessionName(project: ProjectConfig, task: Task, stage = "build"): string {
  if (task.session) return task.session;
  return fill(project.sessionName, { task: task.id, slug: slugFor(task), stage });
}

export function branchName(project: ProjectConfig, task: Task): string {
  if (task.branch) return task.branch;
  return fill(project.branchPattern, { role: task.owner, task: task.id, slug: slugFor(task) });
}
