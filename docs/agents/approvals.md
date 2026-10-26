# Pantheon approvals

Actions only the owner may take. Agents prepare, the owner decides.

| ID | Requesting agent | Action | What is prepared | Risk | Status |
|---|---|---|---|---|---|
| A-001 | claude | Create the private GitHub repo lastkdj/pantheon | Empty repo, no README or license | Low: a new private repo with no data | approved (owner, 2026-10-26) |
| A-002 | claude | Create the Vercel project pantheon in the owner's team, linked to the repo | Next.js project, production branch main, Vercel Authentication on for all default URLs | Low: protected deployment. Medium if a custom domain is attached without protection | approved (owner, 2026-10-26) |
| A-003 | claude | Add a read-only GITHUB_READ_TOKEN to the Vercel project so Pantheon shows live data | Steps: create a fine-grained GitHub token with Contents read-only on lastkdj/Mygold and lastkdj/pantheon, then add it in Vercel (pantheon, Settings, Environment Variables) for Production and Preview, then redeploy. The token must never be pasted into chat or committed | Medium: a credential. Read-only and limited to two repos, so the worst case is exposure of the agent board text | pending |
| A-004 | claude | Retire the MyGold Agent Floor artifact, remove its comment watch, and archive the standing sessions | Pantheon shows the same board, approvals and costs. Nothing is deleted from MyGold's markdown files | Medium: ends sessions the owner may still want. Archiving can be reversed by unarchiving | pending |
