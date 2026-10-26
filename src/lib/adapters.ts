import { columnIndex, parseTables, type Table } from "./markdown-table";
import {
  APPROVAL_STATUSES,
  TASK_STATUSES,
  type Approval,
  type ApprovalStatus,
  type Issue,
  type Task,
  type TaskStatus,
  type Usage,
  type UsageTask,
  type UsageTotal,
} from "./schema";

export interface Parsed<T> {
  value: T;
  issues: Issue[];
}

const PR_RE = /https:\/\/github\.com\/[^\s)]+\/pull\/(\d+)/;
const BRANCH_RE = /\b(agent\/[a-z0-9-]+\/[A-Za-z0-9._-]+)/;
/** Fallback: "branch feat/some-name" (must contain a slash, so prose like "branch is merged" never matches). */
const BRANCH_WORD_RE = /\bbranch\s+`?([A-Za-z0-9._-]+\/[A-Za-z0-9._/-]+)`?/;
const ID_RE = /^[A-Za-z]+-\d+$/;

function findTable(tables: Table[], ...required: string[]): Table | undefined {
  return tables.find((t) => required.every((r) => columnIndex(t.headers, r) !== -1));
}

function parseDeps(cell: string): string[] {
  const trimmed = cell.trim().toLowerCase();
  if (trimmed === "" || trimmed === "none" || trimmed === "-") return [];
  return cell
    .split(/[\s,]+/)
    .map((d) => d.trim())
    .filter((d) => ID_RE.test(d));
}

export function parseBoard(text: string, file = "board.md"): Parsed<Task[]> {
  const issues: Issue[] = [];
  const table = findTable(parseTables(text), "ID", "Title", "Owner", "Status", "Depends on");
  if (!table) {
    issues.push({
      severity: "error",
      file,
      message: "No board table found. Expected columns: ID, Title, Owner, Status, Depends on.",
    });
    return { value: [], issues };
  }
  const col = (...n: string[]) => columnIndex(table.headers, ...n);
  const idx = {
    id: col("ID"),
    title: col("Title"),
    owner: col("Owner"),
    status: col("Status"),
    deps: col("Depends on"),
    output: col("Output or contract path", "Output"),
    notes: col("Notes"),
    session: col("Session"),
    tier: col("Tier"),
  };
  const cell = (cells: string[], i: number) => (i === -1 ? "" : (cells[i] ?? ""));

  const tasks: Task[] = [];
  for (const row of table.rows) {
    const id = cell(row.cells, idx.id);
    if (!ID_RE.test(id)) {
      issues.push({ severity: "error", file, line: row.line, message: `Row has no valid task ID (got "${id}").` });
      continue;
    }
    if (row.cells.length < table.headers.length - 1) {
      issues.push({
        severity: "error",
        file,
        line: row.line,
        message: `${id}: row has ${row.cells.length} cells, expected ${table.headers.length}.`,
      });
      continue;
    }
    if (row.merged) {
      issues.push({
        severity: "warning",
        file,
        line: row.line,
        message: `${id}: row has extra "|" characters; the extra cells were merged into the last column.`,
      });
    }
    const status = cell(row.cells, idx.status).toLowerCase() as TaskStatus;
    if (!TASK_STATUSES.includes(status)) {
      issues.push({
        severity: "error",
        file,
        line: row.line,
        message: `${id}: unknown status "${cell(row.cells, idx.status)}". Known: ${TASK_STATUSES.join(", ")}.`,
      });
      continue;
    }
    const output = cell(row.cells, idx.output);
    const prMatch = output.match(PR_RE);
    const branchMatch = output.match(BRANCH_RE);
    tasks.push({
      id,
      title: cell(row.cells, idx.title),
      owner: cell(row.cells, idx.owner),
      status,
      deps: parseDeps(cell(row.cells, idx.deps)),
      output,
      notes: cell(row.cells, idx.notes),
      session: cell(row.cells, idx.session) || undefined,
      tier: cell(row.cells, idx.tier) || undefined,
      branch: branchMatch?.[1] ?? output.match(BRANCH_WORD_RE)?.[1],
      pr: prMatch ? { url: prMatch[0], number: Number(prMatch[1]) } : undefined,
    });
  }
  return { value: tasks, issues };
}

export function parseApprovals(text: string, file = "approvals.md"): Parsed<Approval[]> {
  const issues: Issue[] = [];
  const table = findTable(parseTables(text), "ID", "Action", "Status");
  if (!table) {
    issues.push({
      severity: "error",
      file,
      message: "No approvals table found. Expected columns: ID, Action, Status.",
    });
    return { value: [], issues };
  }
  const col = (...n: string[]) => columnIndex(table.headers, ...n);
  const idx = {
    id: col("ID"),
    agent: col("Requesting agent", "Agent"),
    action: col("Action"),
    prepared: col("What is prepared", "Prepared"),
    risk: col("Risk"),
    status: col("Status"),
  };
  const cell = (cells: string[], i: number) => (i === -1 ? "" : (cells[i] ?? ""));

  const approvals: Approval[] = [];
  for (const row of table.rows) {
    const id = cell(row.cells, idx.id);
    if (!ID_RE.test(id)) {
      issues.push({ severity: "error", file, line: row.line, message: `Row has no valid approval ID (got "${id}").` });
      continue;
    }
    const rawStatus = cell(row.cells, idx.status);
    const word = rawStatus.split(/[\s(—-]+/)[0].toLowerCase() as ApprovalStatus;
    if (!APPROVAL_STATUSES.includes(word)) {
      issues.push({
        severity: "error",
        file,
        line: row.line,
        message: `${id}: unknown status "${rawStatus}". Known: ${APPROVAL_STATUSES.join(", ")}.`,
      });
      continue;
    }
    approvals.push({
      id,
      agent: cell(row.cells, idx.agent),
      action: cell(row.cells, idx.action),
      prepared: cell(row.cells, idx.prepared),
      risk: cell(row.cells, idx.risk),
      status: word,
      statusNote: rawStatus.slice(word.length).replace(/^[\s—-]+/, ""),
    });
  }
  return { value: approvals, issues };
}

export function parseUsd(text: string): number | null {
  const m = text.match(/\$\s?([\d,]+(?:\.\d+)?)/);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

export function parseTokens(text: string): number | null {
  const m = text.trim().match(/^~?([\d,]+(?:\.\d+)?)\s*([kKmM]?)/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  const mult = m[2].toLowerCase() === "k" ? 1_000 : m[2].toLowerCase() === "m" ? 1_000_000 : 1;
  return Math.round(n * mult);
}

export function parseUsage(text: string): Parsed<Usage> {
  const issues: Issue[] = [];
  const tables = parseTables(text);
  const totals: UsageTotal[] = [];
  const perTask: UsageTask[] = [];

  for (const table of tables) {
    const col = (...n: string[]) => columnIndex(table.headers, ...n);
    if (col("Task") !== -1 && col("Tokens", "USD", "Cost") !== -1) {
      const idx = {
        task: col("Task"),
        session: col("Session"),
        model: col("Model"),
        tokens: col("Tokens"),
        usd: col("USD", "Cost"),
        date: col("Date"),
      };
      const get = (cells: string[], i: number) => (i === -1 ? "" : (cells[i] ?? ""));
      for (const row of table.rows) {
        perTask.push({
          task: get(row.cells, idx.task),
          session: get(row.cells, idx.session),
          model: get(row.cells, idx.model),
          tokens: parseTokens(get(row.cells, idx.tokens)),
          usd: parseUsd(get(row.cells, idx.usd)) ?? (Number.isFinite(Number(get(row.cells, idx.usd))) && get(row.cells, idx.usd) !== "" ? Number(get(row.cells, idx.usd)) : null),
          date: get(row.cells, idx.date),
        });
      }
    } else if (col("What") !== -1 && col("Cost") !== -1) {
      const idx = { label: col("What"), cost: col("Cost"), notes: col("Notes") };
      for (const row of table.rows) {
        const costText = row.cells[idx.cost] ?? "";
        totals.push({
          label: row.cells[idx.label] ?? "",
          costText,
          usd: parseUsd(costText),
          notes: idx.notes === -1 ? "" : (row.cells[idx.notes] ?? ""),
        });
      }
    }
  }
  return { value: { totals, perTask }, issues };
}
