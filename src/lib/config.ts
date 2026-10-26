import raw from "../../pantheon.config.json";

export type SourceConfig =
  | { type: "github"; repo: string; branch: string; fallbackDir?: string }
  | { type: "fixtures"; dir: string };

export interface ProjectConfig {
  id: string;
  name: string;
  /** Link target for task sessions, e.g. "https://claude.ai/code". */
  sessionsUrl?: string;
  source: SourceConfig;
  files: { board: string; approvals: string; usage: string };
  /** Pattern for task session names. Tokens: {task} {slug} {stage}. */
  sessionName: string;
  /** Pattern for task branches. Tokens: {role} {task} {slug}. */
  branchPattern: string;
  /** Repo-relative path of the short rules file referenced from each brief. */
  rulesPath?: string;
}

export const projects: ProjectConfig[] = raw.projects as ProjectConfig[];

export function getProject(id: string): ProjectConfig | undefined {
  return projects.find((p) => p.id === id);
}
