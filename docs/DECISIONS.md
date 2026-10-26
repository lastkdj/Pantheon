# Decisions

| ID | Decision | Why | Date |
|---|---|---|---|
| D-001 | Pantheon is its own repo, not a folder inside MyGold | It must work for other projects, and it should not be part of the marketplace build or its production review | 2026-10-26 |
| D-002 | The name is Pantheon | Chosen by the owner | 2026-10-26 |
| D-003 | The markdown tables are the contract; Pantheon reads them and never writes | Agent state already lives in git. A second store would drift, and writing would put a credential in the app | 2026-10-26 |
| D-004 | Hosted on Vercel with Vercel Authentication | Simplest owner-only access. Re-check if a custom domain is added | 2026-10-26 |
| D-005 | Pantheon keeps its own board and approvals under docs/agents, separate from MyGold's | The owner wants it isolated and standalone. It also lets Pantheon display itself | 2026-10-26 |
| D-006 | Changes go on a branch and deploy as a preview first. Main is production | Matches the owner's approval rule: nothing reaches production unseen | 2026-10-26 |
| D-007 | Pantheon has its own bespoke design, sampled from the owner's reference image, not MyGold's design system | It is a separate product. The first build reused MyGold's gold-on-black palette by default, which was wrong | 2026-10-26 |
| D-008 | Each agent role is a procedural SVG creature, stable per role name | Gives the product a personality like the reference's characters without needing illustration assets | 2026-10-26 |
