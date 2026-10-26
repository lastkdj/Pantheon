# Markdown format (schema v1)

Pantheon reads pipe tables. Column names are matched case-insensitively. A row may omit its trailing `|`.

## Board (required columns)

`ID | Title | Owner | Status | Depends on` plus optional `Output or contract path` (or `Output`), `Notes`, `Session`, `Tier`.

- **ID**: letters, a dash and digits, for example `T-012`. Never reused.
- **Status**: `todo`, `in-progress`, `review`, `blocked`, `done`. Anything else is an error and the row is skipped.
- **Depends on**: comma or space separated IDs, or `none`. An ID may be another task or an approval; an approval is a met dependency when it is `approved`.
- A PR URL (`https://github.com/<owner>/<repo>/pull/<n>`) and a branch (`agent/<role>/<id>-<slug>`) inside the output cell are picked up automatically.
- **Session** (optional): explicit session name. Without it, the name comes from the project's `sessionName` pattern.

## Approvals (required columns)

`ID | Action | Status` plus `Requesting agent`, `What is prepared`, `Risk`.

- **Status**: starts with `pending`, `approved`, `rejected` or `deferred`. Text after the word is kept as a note.

## Usage

Two optional table shapes, both read:

- Per task: `Task | Session | Model | Tokens | USD | Date`. One row per task session. Tokens accept `565k` or `1.2M`.
- Totals: `What | Cost | Notes`.

## What counts as an error

Shown on the Health page, never silently dropped: missing table, row with too few cells, unknown status, invalid ID, duplicate ID, a dependency that is neither a task nor an approval. Extra `|` characters in a row are a warning; the extra cells are merged into the last column.
