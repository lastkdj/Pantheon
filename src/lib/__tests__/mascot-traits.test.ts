import { describe, expect, it } from "vitest";
import { BODY_COUNT, EXTRA_COUNT, EYE_COUNT, MOUTH_COUNT, PALETTE_COUNT, hashRole, mascotTraits } from "../mascot-traits";

describe("mascotTraits", () => {
  // Regression: a signed shift once produced negative indexes, so some creatures had no face.
  it("always yields valid indexes, for any role name", () => {
    const names = ["", "a", "qa", "backend", "frontend", "auth-security", "code-reviewer", "product-analyst", "unknown", "Claude (discovery)", "héllo ✨", "x".repeat(500)];
    for (let i = 0; i < 2000; i++) names.push(`role-${i}`);
    for (const n of names) {
      const t = mascotTraits(n);
      expect(t.palette).toBeGreaterThanOrEqual(0);
      expect(t.palette).toBeLessThan(PALETTE_COUNT);
      expect(t.body).toBeGreaterThanOrEqual(0);
      expect(t.body).toBeLessThan(BODY_COUNT);
      expect(t.eyes).toBeGreaterThanOrEqual(0);
      expect(t.eyes).toBeLessThan(EYE_COUNT);
      expect(t.extra).toBeGreaterThanOrEqual(0);
      expect(t.extra).toBeLessThan(EXTRA_COUNT);
      expect(t.mouth).toBeGreaterThanOrEqual(0);
      expect(t.mouth).toBeLessThan(MOUTH_COUNT);
      expect(Number.isFinite(t.delay)).toBe(true);
    }
  });
  it("is stable for the same role", () => {
    expect(mascotTraits("financial")).toEqual(mascotTraits("financial"));
    expect(hashRole("financial")).toBeGreaterThanOrEqual(0);
  });
  it("spreads the real MyGold roles over several different looks", () => {
    const roles = ["architect", "auth-security", "backend", "code-reviewer", "database", "devops", "docs", "financial", "frontend", "orchestrator", "product-analyst", "qa"];
    const looks = new Set(roles.map((r) => JSON.stringify([mascotTraits(r).palette, mascotTraits(r).body, mascotTraits(r).eyes])));
    expect(looks.size).toBeGreaterThanOrEqual(10);
  });
});
