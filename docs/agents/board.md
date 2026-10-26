# Pantheon board

Pantheon tracks its own work in the same format it reads. See [../FORMAT.md](../FORMAT.md).

| ID | Title | Owner | Status | Depends on | Output or contract path | Notes |
|---|---|---|---|---|---|---|
| P-001 | Create the standalone repo and name the project | owner | done | A-001 | https://github.com/lastkdj/pantheon | Named Pantheon on 2026-10-26. Separate from MyGold so it can serve other projects. |
| P-002 | Data layer: markdown adapters, validation, GitHub and snapshot sources | backend | done | P-001 | src/lib/ | Golden tests run against the real MyGold board and a sample project. Found three format facts the MyGold docs did not mention: a deferred approval status, tasks that depend on approvals, and rows without a trailing pipe. |
| P-003 | First read-only pages: board, task, approvals, costs, health | frontend | done | P-002 | src/app/p/ | Checked at desktop and phone width with no horizontal overflow. |
| P-004 | Create the Vercel project with access protection | devops | done | A-002 | https://vercel.com/ricardos-projects-a34fcb10/pantheon | Vercel Authentication covers all default URLs. Do not attach a custom domain without protecting it. |
| P-005 | UI overhaul: overview that leads with what needs the owner, role seals, filterable board, task stepper | frontend | review | P-003 | branch feat/ui-overhaul | Preview deployment first, then merge to main after the owner has seen it. |
| P-006 | Live data: read-only GitHub token in Vercel | devops | blocked | A-003 | none yet | Only the owner can create the token. Steps are in approvals.md under A-003. |
| P-007 | Retire the MyGold Agent Floor artifact and its standing sessions | docs | todo | P-005, A-004 | none yet | Starts only after the owner has seen Pantheon and says go. |
