import { describe, expect, it, vi } from "vitest";
import type { ProjectConfig } from "../config";
import { projects } from "../config";
import { readProjectFile } from "../source";

const mygold = projects.find((p) => p.id === "mygold")! as ProjectConfig;
const sample = projects.find((p) => p.id === "sample")! as ProjectConfig;

describe("readProjectFile", () => {
  it("reads fixtures for a fixtures project", async () => {
    const f = await readProjectFile(sample, "board", {});
    expect(f.origin).toBe("fixtures");
    expect(f.text).toMatch(/W-001/);
    expect(f.warning).toBeUndefined();
  });
  it("falls back with a visible warning when no token is set", async () => {
    const f = await readProjectFile(mygold, "board", {});
    expect(f.origin).toBe("fixtures");
    expect(f.warning).toMatch(/No GITHUB_READ_TOKEN/);
  });
  it("uses GitHub when a token is set, sending a bearer token and the branch", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("| live |", { status: 200 }));
    const f = await readProjectFile(mygold, "board", { GITHUB_READ_TOKEN: "tok" }, fetcher as unknown as typeof fetch);
    expect(f).toEqual({ text: "| live |", origin: "github" });
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.github.com/repos/lastkdj/Mygold/contents/docs/agents/board.md?ref=dev");
    expect((init as RequestInit).headers).toMatchObject({ Authorization: "Bearer tok" });
  });
  it("falls back with the reason when GitHub fails", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("nope", { status: 404 }));
    const f = await readProjectFile(mygold, "board", { GITHUB_READ_TOKEN: "tok" }, fetcher as unknown as typeof fetch);
    expect(f.origin).toBe("fixtures");
    expect(f.warning).toMatch(/GitHub returned 404/);
  });
  it("never leaks the token into the warning", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("boom"));
    const f = await readProjectFile(mygold, "board", { GITHUB_READ_TOKEN: "secret-token" }, fetcher as unknown as typeof fetch);
    expect(f.warning).not.toMatch(/secret-token/);
  });
});
