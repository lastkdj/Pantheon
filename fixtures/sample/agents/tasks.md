# Tidewatch task board

Invented sample project used to prove Pantheon needs only a config entry, not code changes.

| ID | Title | Owner | Status | Depends on | Output or contract path | Notes | Tier |
|---|---|---|---|---|---|---|---|
| W-001 | Chart the harbour sensor schema | analyst | done | none | docs/schema.md | Agreed with the harbour master. | A |
| W-002 | Ingest tide readings | builder | in-progress | W-001 | branch work/W-002-ingest-tide-readings | Batch size 500. | B |
| W-003 | Alert on surge threshold | builder | todo | W-002 | none yet | Needs threshold from ops. | C |
| W-004 | Tide chart page | builder | review | W-001 | PR https://github.com/example/tidewatch/pull/7 | Awaiting reviewer. | B |
| W-005 | Retire the old pager integration | ops | blocked | W-003 | none yet | Blocked on vendor contract end date. | C |
