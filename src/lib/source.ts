import { promises as fs } from "node:fs";
import path from "node:path";
import type { ProjectConfig } from "./config";

export type Origin = "github" | "fixtures";

export interface SourceFile {
  text: string;
  origin: Origin;
  /** Set when the live source failed or was unavailable and a fixture snapshot was used. */
  warning?: string;
}

type Fetcher = typeof fetch;

async function readFixture(dir: string, relPath: string): Promise<string> {
  const root = path.resolve(process.cwd(), dir);
  const file = path.resolve(root, relPath);
  if (!file.startsWith(root + path.sep)) throw new Error(`Refusing to read outside ${dir}: ${relPath}`);
  return fs.readFile(file, "utf8");
}

export async function readFromGithub(
  repo: string,
  branch: string,
  relPath: string,
  token: string,
  fetcher: Fetcher = fetch,
): Promise<string> {
  const url = `https://api.github.com/repos/${repo}/contents/${relPath}?ref=${encodeURIComponent(branch)}`;
  const res = await fetcher(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.raw+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "pantheon",
    },
    next: { revalidate: 60 },
  } as RequestInit);
  if (!res.ok) throw new Error(`GitHub returned ${res.status} for ${relPath}`);
  return res.text();
}

/**
 * Read one tracked file. With a read token, the live repo is the source of truth.
 * Without it, or when GitHub fails, the bundled fixture snapshot is shown with a warning,
 * never silently.
 */
export async function readProjectFile(
  project: ProjectConfig,
  key: keyof ProjectConfig["files"],
  env: Record<string, string | undefined> = process.env,
  fetcher: Fetcher = fetch,
): Promise<SourceFile> {
  const relPath = project.files[key];
  const source = project.source;
  if (source.type === "fixtures") {
    return { text: await readFixture(source.dir, relPath), origin: "fixtures" };
  }
  const token = env.GITHUB_READ_TOKEN;
  if (token) {
    try {
      return { text: await readFromGithub(source.repo, source.branch, relPath, token, fetcher), origin: "github" };
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown error";
      return fallback(source, relPath, `Live data unavailable (${reason}). Showing a snapshot.`);
    }
  }
  return fallback(source, relPath, "No GITHUB_READ_TOKEN set. Showing a snapshot, not live data.");
}

async function fallback(
  source: Extract<ProjectConfig["source"], { type: "github" }>,
  relPath: string,
  warning: string,
): Promise<SourceFile> {
  if (!source.fallbackDir) throw new Error(`${warning} No fixture fallback is configured.`);
  return { text: await readFixture(source.fallbackDir, relPath), origin: "fixtures", warning };
}
