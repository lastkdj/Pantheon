import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseApprovals, parseBoard, parseTokens, parseUsage, parseUsd } from "../adapters";
import { readyTasks, validate } from "../validate";

const fx = (...p: string[]) => readFileSync(path.join(__dirname, "../../../fixtures", ...p), "utf8");

describe("MyGold fixtures (golden)", () => {
  const board = parseBoard(fx("mygold/docs/agents/board.md"));
  const approvals = parseApprovals(fx("mygold/docs/agents/approvals.md"));
  const usage = parseUsage(fx("mygold/docs/agents/token-usage.md"));

  it("parses every board row, including rows without a trailing pipe", () => {
    expect(board.issues).toEqual([]);
    expect(board.value).toHaveLength(40);
    expect(board.value.find((t) => t.id === "T-006")?.pr?.number).toBe(12);
  });
  it("extracts PR and branch references", () => {
    const t24 = board.value.find((t) => t.id === "T-024");
    expect(t24?.status).toBe("review");
    expect(t24?.branch).toBe("agent/frontend/T-024-checkout-error-display");
    expect(board.value.find((t) => t.id === "T-004")?.pr?.url).toBe("https://github.com/lastkdj/Mygold/pull/9");
  });
  it("parses dependencies", () => {
    expect(board.value.find((t) => t.id === "T-006")?.deps).toEqual(["T-003", "T-005"]);
    expect(board.value.find((t) => t.id === "T-001")?.deps).toEqual([]);
  });
  it("parses approvals with the status word split from its note", () => {
    expect(approvals.issues).toEqual([]);
    expect(approvals.value).toHaveLength(12);
    const a1 = approvals.value.find((a) => a.id === "A-001");
    expect(a1?.status).toBe("approved");
    expect(a1?.statusNote).toMatch(/^\(owner, 2026-10-24/);
  });
  it("reads the totals table of the current usage log", () => {
    expect(usage.value.totals.length).toBeGreaterThanOrEqual(5);
    expect(usage.value.totals[0].usd).toBe(65.31);
    expect(usage.value.perTask).toEqual([]);
  });
  it("accepts the deferred approval status seen in A-011", () => {
    expect(approvals.value.find((a) => a.id === "A-011")?.status).toBe("deferred");
  });
  it("lets tasks depend on approvals", () => {
    expect(board.value.find((t) => t.id === "T-007")?.deps).toContain("A-004");
  });
  it("has no cross-file errors", () => {
    const errors = validate(board.value, approvals.value).filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
  });
});

describe("sample project fixtures", () => {
  it("parses a board that has the optional Tier column", () => {
    const board = parseBoard(fx("sample/agents/tasks.md"));
    expect(board.issues).toEqual([]);
    expect(board.value).toHaveLength(5);
    expect(board.value[1].tier).toBe("B");
    expect(board.value[1].branch).toBe("work/W-002-ingest-tide-readings");
  });
  it("reads a per-task usage table", () => {
    const usage = parseUsage(fx("sample/agents/costs.md"));
    expect(usage.value.perTask).toHaveLength(3);
    expect(usage.value.perTask[1]).toMatchObject({ task: "W-002", tokens: 340_000, usd: 0.92 });
  });
  it("finds ready tasks", () => {
    const board = parseBoard(fx("sample/agents/tasks.md"));
    expect(readyTasks(board.value)).toEqual([]);
  });
});

describe("Pantheon's own docs", () => {
  const root = path.join(__dirname, "../../../docs/agents");
  const board = parseBoard(readFileSync(path.join(root, "board.md"), "utf8"));
  const approvals = parseApprovals(readFileSync(path.join(root, "approvals.md"), "utf8"));

  it("parse without any issue, so its own dashboard cannot silently break", () => {
    expect(board.issues).toEqual([]);
    expect(approvals.issues).toEqual([]);
    expect(validate(board.value, approvals.value)).toEqual([]);
  });
  it("show what is waiting on the owner", () => {
    expect(approvals.value.filter((a) => a.status === "pending").map((a) => a.id)).toEqual(["A-003", "A-004"]);
    expect(board.value.find((t) => t.id === "P-005")?.branch).toBe("feat/ui-overhaul");
  });
});

describe("malformed input", () => {
  const header = "| ID | Title | Owner | Status | Depends on | Output | Notes |\n|---|---|---|---|---|---|---|\n";

  it("reports an unknown status and skips the row", () => {
    const r = parseBoard(header + "| T-001 | a | x | wip | none | | |");
    expect(r.value).toHaveLength(0);
    expect(r.issues[0]).toMatchObject({ severity: "error", line: 3 });
    expect(r.issues[0].message).toMatch(/unknown status "wip"/);
  });
  it("reports a row with too few cells", () => {
    const r = parseBoard(header + "| T-001 | a | x");
    expect(r.value).toHaveLength(0);
    expect(r.issues[0].message).toMatch(/expected 7/);
  });
  it("warns when extra pipes get merged", () => {
    const r = parseBoard(header + "| T-001 | a | x | todo | none | out | notes | extra |");
    expect(r.value).toHaveLength(1);
    expect(r.issues[0].severity).toBe("warning");
  });
  it("reports a missing table instead of returning nothing silently", () => {
    const r = parseBoard("# Nothing here");
    expect(r.issues[0].message).toMatch(/No board table found/);
  });
  it("does not mistake prose for a branch name", () => {
    const r = parseBoard(header + "| T-001 | a | x | todo | none | the branch is merged | |");
    expect(r.value[0].branch).toBeUndefined();
  });
  it("reports a row without a valid ID", () => {
    const r = parseBoard(header + "| nope | a | x | todo | none | | |");
    expect(r.issues[0].message).toMatch(/no valid task ID/);
  });
  it("rejects an unknown approval status", () => {
    const r = parseApprovals("| ID | Requesting agent | Action | What is prepared | Risk | Status |\n|---|---|---|---|---|---|\n| A-001 | x | y | z | low | maybe |");
    expect(r.value).toHaveLength(0);
    expect(r.issues[0].message).toMatch(/unknown status "maybe"/);
  });
});

describe("validate", () => {
  const mk = (id: string, deps: string[] = [], status: "todo" | "done" | "review" = "todo") => ({
    id, title: id, owner: "x", status, deps, output: "", notes: "",
  });
  it("flags duplicate IDs, missing and self dependencies", () => {
    const issues = validate([mk("T-001"), mk("T-001"), mk("T-002", ["T-999", "T-002"])], []);
    const messages = issues.map((i) => i.message).join("\n");
    expect(messages).toMatch(/Duplicate task ID T-001/);
    expect(messages).toMatch(/T-002 depends on T-999/);
    expect(messages).toMatch(/depends on itself/);
  });
  it("warns about a review task with no PR or branch", () => {
    const issues = validate([mk("T-001", [], "review")], []);
    expect(issues[0].severity).toBe("warning");
  });
  it("treats an approved approval as a met dependency, and a pending one as unmet", () => {
    const tasks = [mk("T-001", ["A-001"]), mk("T-002", ["A-002"])];
    const approvals = [
      { id: "A-001", agent: "", action: "", prepared: "", risk: "", status: "approved" as const, statusNote: "" },
      { id: "A-002", agent: "", action: "", prepared: "", risk: "", status: "pending" as const, statusNote: "" },
    ];
    expect(validate(tasks, approvals)).toEqual([]);
    expect(readyTasks(tasks, approvals).map((t) => t.id)).toEqual(["T-001"]);
  });
  it("marks a task ready only when every dependency is done", () => {
    const tasks = [mk("T-001", [], "done"), mk("T-002", ["T-001"]), mk("T-003", ["T-002"])];
    expect(readyTasks(tasks).map((t) => t.id)).toEqual(["T-002"]);
  });
});

describe("number parsers", () => {
  it("reads dollars and token counts", () => {
    expect(parseUsd("~$14.5")).toBe(14.5);
    expect(parseUsd("none")).toBeNull();
    expect(parseTokens("565k")).toBe(565_000);
    expect(parseTokens("1.2M")).toBe(1_200_000);
    expect(parseTokens("12,345")).toBe(12_345);
    expect(parseTokens("n/a")).toBeNull();
  });
});
