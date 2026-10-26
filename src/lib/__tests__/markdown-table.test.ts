import { describe, expect, it } from "vitest";
import { columnIndex, parseTables, splitRow } from "../markdown-table";

describe("splitRow", () => {
  it("handles a row with and without a trailing pipe", () => {
    expect(splitRow("| a | b | c |")).toEqual(["a", "b", "c"]);
    expect(splitRow("| a | b | c")).toEqual(["a", "b", "c"]);
  });
  it("keeps escaped pipes inside a cell", () => {
    expect(splitRow("| a \\| b | c |")).toEqual(["a | b", "c"]);
  });
});

describe("parseTables", () => {
  const md = ["# Title", "", "| A | B |", "|---|---|", "| 1 | 2 |", "| 3 | 4 | 5 |", "", "text", "", "| X |", "|---|", "| y |"].join("\n");

  it("finds every table with 1-based line numbers", () => {
    const tables = parseTables(md);
    expect(tables).toHaveLength(2);
    expect(tables[0].rows[0]).toMatchObject({ cells: ["1", "2"], line: 5, merged: false });
    expect(tables[1].headers).toEqual(["X"]);
  });
  it("merges extra cells into the last column and flags the row", () => {
    const row = parseTables(md)[0].rows[1];
    expect(row.cells).toEqual(["3", "4 | 5"]);
    expect(row.merged).toBe(true);
  });
  it("matches header names case-insensitively", () => {
    expect(columnIndex(["ID", "Depends on"], "depends on")).toBe(1);
    expect(columnIndex(["ID"], "Nope")).toBe(-1);
  });
});
