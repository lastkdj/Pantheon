import { getProject, type ProjectConfig } from "./config";
import { parseApprovals, parseBoard, parseUsage } from "./adapters";
import type { Issue, ProjectState } from "./schema";
import { readProjectFile, type Origin } from "./source";
import { validate } from "./validate";

export interface LoadedProject {
  project: ProjectConfig;
  state: ProjectState;
  origin: Origin;
  warnings: string[];
}

export async function loadProject(id: string): Promise<LoadedProject | null> {
  const project = getProject(id);
  if (!project) return null;

  const [board, approvals, usage] = await Promise.all([
    readProjectFile(project, "board"),
    readProjectFile(project, "approvals"),
    readProjectFile(project, "usage"),
  ]);

  const parsedBoard = parseBoard(board.text, project.files.board);
  const parsedApprovals = parseApprovals(approvals.text, project.files.approvals);
  const parsedUsage = parseUsage(usage.text);

  const issues: Issue[] = [
    ...parsedBoard.issues,
    ...parsedApprovals.issues,
    ...parsedUsage.issues,
    ...validate(parsedBoard.value, parsedApprovals.value, project.files.board, project.files.approvals),
  ];

  const warnings = [...new Set([board.warning, approvals.warning, usage.warning].filter((w): w is string => !!w))];
  const origin: Origin = [board, approvals, usage].every((f) => f.origin === "github") ? "github" : "fixtures";

  return {
    project,
    origin,
    warnings,
    state: { tasks: parsedBoard.value, approvals: parsedApprovals.value, usage: parsedUsage.value, issues },
  };
}
