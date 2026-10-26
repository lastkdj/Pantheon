import { describe, expect, it } from "vitest";
import { initials, riskLevel, roleHue } from "../roles";
import type { Approval, Task, Usage } from "../schema";
import { overview } from "../stats";

const task = (id: string, owner: string, status: Task["status"], deps: string[] = []): Task => ({
  id, title: id, owner, status, deps, output: "", notes: "",
});
const approval = (id: string, status: Approval["status"]): Approval => ({
  id, agent: "", action: "", prepared: "", risk: "", status, statusNote: "",
});
const noUsage: Usage = { totals: [], perTask: [] };

describe("overview", () => {
  const tasks = [
    task("T-1", "backend", "done"),
    task("T-2", "backend", "in-progress", ["T-1"]),
    task("T-3", "frontend", "review"),
    task("T-4", "frontend", "blocked"),
    task("T-5", "qa", "todo", ["T-1"]),
    task("T-6", "qa", "todo", ["T-2"]),
  ];
  const o = overview(tasks, [approval("A-1", "pending"), approval("A-2", "approved")], noUsage);

  it("counts tasks per status and percent done", () => {
    expect(o.total).toBe(6);
    expect(o.byStatus).toEqual({ todo: 2, "in-progress": 1, review: 1, blocked: 1, done: 1 });
    expect(o.percentDone).toBe(17);
  });
  it("lists what needs the owner", () => {
    expect(o.pendingApprovals.map((a) => a.id)).toEqual(["A-1"]);
    expect(o.inReview.map((t) => t.id)).toEqual(["T-3"]);
    expect(o.blocked.map((t) => t.id)).toEqual(["T-4"]);
  });
  it("finds tasks that are ready to start", () => {
    expect(o.ready.map((t) => t.id)).toEqual(["T-5"]);
  });
  it("tallies workload, busiest role first, ties by name", () => {
    expect(o.workload.find((w) => w.owner === "backend")).toMatchObject({ open: 1, inProgress: 1, done: 1 });
    // frontend and qa both have 2 open (tie broken by name); backend has 1.
    expect(o.workload.map((w) => w.owner)).toEqual(["frontend", "qa", "backend"]);
  });
  it("breaks each agent's tasks down by status", () => {
    const fe = o.workload.find((w) => w.owner === "frontend")!;
    expect(fe.total).toBe(2);
    expect(fe.byStatus).toEqual({ todo: 0, "in-progress": 0, review: 1, blocked: 1, done: 0 });
  });
  it("tallies approvals as pending versus decided", () => {
    expect(o.approvalTally).toEqual({ pending: 1, decided: 1, total: 2 });
  });
  it("handles an empty board", () => {
    const e = overview([], [], noUsage);
    expect(e.percentDone).toBe(0);
    expect(e.spend).toBeNull();
  });
  it("prefers per-task spend, falls back to the first reported total", () => {
    const perTask = overview([], [], {
      totals: [{ label: "x", costText: "$9", usd: 9, notes: "" }],
      perTask: [
        { task: "T-1", session: "", model: "", tokens: null, usd: 1.5, date: "" },
        { task: "T-2", session: "", model: "", tokens: null, usd: 2, date: "" },
      ],
    });
    expect(perTask.spend).toEqual({ usd: 3.5, basis: "per-task" });
    const reported = overview([], [], { totals: [{ label: "x", costText: "$65.31", usd: 65.31, notes: "" }], perTask: [] });
    expect(reported.spend).toEqual({ usd: 65.31, basis: "reported total" });
  });
});

describe("roles", () => {
  it("builds monograms", () => {
    expect(initials("auth-security")).toBe("AS");
    expect(initials("qa")).toBe("QA");
    expect(initials("backend")).toBe("BA");
    expect(initials("")).toBe("?");
  });
  it("gives the same hue for the same role", () => {
    expect(roleHue("financial")).toBe(roleHue("financial"));
    expect(roleHue("financial")).not.toBe(roleHue("frontend"));
  });
  it("reads a leading risk level", () => {
    expect(riskLevel("High: payment code")).toBe("high");
    expect(riskLevel("Critical: live key")).toBe("critical");
    expect(riskLevel("medium. Policy mistakes")).toBe("medium");
    expect(riskLevel("Wrong change could reject")).toBeNull();
  });
});

import { STACK } from "../stack";
import { TASK_STATUSES } from "../schema";

describe("stack", () => {
  it("lists every task status exactly once, so no segment can go missing from a bar", () => {
    expect(STACK.map((s) => s.status).sort()).toEqual([...TASK_STATUSES].sort());
  });
});
