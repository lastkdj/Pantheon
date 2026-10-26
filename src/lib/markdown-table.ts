export interface TableRow {
  cells: string[];
  /** 1-based line number in the source file. */
  line: number;
  /** True when the row had more cells than the header and the extras were merged into the last cell. */
  merged: boolean;
}

export interface Table {
  headers: string[];
  rows: TableRow[];
}

const isSeparator = (line: string) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line);

/** Split a pipe row into trimmed cells. Honors `\|`. A missing trailing pipe is fine. */
export function splitRow(line: string): string[] {
  let body = line.trim();
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|") && !body.endsWith("\\|")) body = body.slice(0, -1);
  const cells: string[] = [];
  let current = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "\\" && body[i + 1] === "|") {
      current += "|";
      i++;
    } else if (ch === "|") {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

/** Extract every pipe table from markdown text. */
export function parseTables(text: string): Table[] {
  const lines = text.split(/\r?\n/);
  const tables: Table[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("|") && i + 1 < lines.length && isSeparator(lines[i + 1])) {
      const headers = splitRow(line);
      const rows: TableRow[] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        let cells = splitRow(lines[j]);
        let merged = false;
        if (cells.length > headers.length) {
          const extra = cells.slice(headers.length - 1).join(" | ");
          cells = [...cells.slice(0, headers.length - 1), extra];
          merged = true;
        }
        rows.push({ cells, line: j + 1, merged });
        j++;
      }
      tables.push({ headers, rows });
      i = j;
    } else {
      i++;
    }
  }
  return tables;
}

/** Index of the first header matching one of the names (case-insensitive), or -1. */
export function columnIndex(headers: string[], ...names: string[]): number {
  const wanted = names.map((n) => n.toLowerCase());
  return headers.findIndex((h) => wanted.includes(h.toLowerCase()));
}
