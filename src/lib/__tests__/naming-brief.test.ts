import { describe, expect, it } from "vitest";
import { buildBrief } from "../brief";
import { projects } from "../config";
import { branchName, sessionName, slugFor, slugify } from "../naming";
import type { Task } from "../schema";

const mygold = projects.find((p) => p.id === "mygold")!;
const sample = projects.find((p) => p.id === "sample")!;

const task = (over: Partial<Task> = {}): Task => ({
  id: "T-012", title: "Stop sellers from unblocking an admin-BLOCKED product", owner: "backend",
  status: "todo", deps: ["T-003"], output: "", notes: "Keep PATCH behaviour.", ...over,
});

describe("naming", () => {
  it("slugifies a title to a few words", () => {
    expect(slugify("Stop sellers from `unblocking` an admin-BLOCKED product")).toBe("stop-sellers-from-unblocking");
  });
  it("reuses the slug already present in the branch", () => {
    expect(slugFor(task({ branch: "agent/backend/T-012-no-unblock" }))).toBe("no-unblock");
  });
  it("builds the session name with the task code first (MyGold pattern)", () => {
    expect(sessionName(mygold, task({ branch: "agent/backend/T-012-no-unblock" }))).toBe("T-012 · no-unblock · build");
    expect(sessionName(mygold, task({ branch: "agent/backend/T-012-no-unblock" }), "review")).toBe("T-012 · no-unblock · review");
  });
  it("supports a different pattern per project", () => {
    expect(sessionName(sample, task({ id: "W-002", title: "Ingest tide readings" }))).toBe("[W-002] ingest-tide-readings / build");
    expect(branchName(sample, task({ id: "W-002", title: "Ingest tide readings" }))).toBe("work/W-002-ingest-tide-readings");
  });
  it("prefers an explicit Session column", () => {
    expect(sessionName(mygold, task({ session: "custom" }))).toBe("custom");
  });
});

describe("buildBrief", () => {
  const all = [task({ id: "T-003", status: "done" }), task()];
  const brief = buildBrief(mygold, all[1], all);
  it("states the session name, branch and dependency state", () => {
    expect(brief).toMatch(/Session name: T-012 · stop-sellers-from-unblocking · build/);
    expect(brief).toMatch(/Branch: agent\/backend\/T-012-stop-sellers-from-unblocking/);
    expect(brief).toMatch(/Depends on: T-003 \(done\)/);
  });
  it("points to the rules file and ends with the stop rule", () => {
    expect(brief).toMatch(/Read docs\/agents\/RULES.md first/);
    expect(brief).toMatch(/Do not mark your own work `done`/);
  });
  it("flags a dependency that is not on the board", () => {
    expect(buildBrief(mygold, task({ deps: ["T-777"] }), [])).toMatch(/T-777 \(missing\)/);
  });
});
