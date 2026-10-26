# CLAUDE.md

Pantheon is a small read-only Next.js dashboard. Keep it that way.

- Read-only: never write to a tracked project, never call a model.
- The markdown format in `docs/FORMAT.md` is the contract. Change parsing only with a test against `fixtures/`.
- Reuse comes from `pantheon.config.json`. Do not hardcode a project name or path in code.
- Never print or commit `GITHUB_READ_TOKEN` or any secret. `.env*` stays untracked.
- UI is Pantheon's own design: a dense analytics dashboard sampled from the owner's references (deep navy surfaces, neon magenta, electric blue and cyan as the data colours, green and red only for good and bad, one gradient call-to-action). Manrope throughout. Tokens live in `tailwind.config.ts`. Do not import another product's design system, and do not add playful decoration (mascots, confetti). Every animation must stop under `prefers-reduced-motion`.
- Before pushing: `npm run test:run`, `npm run typecheck`, `npm run lint`, `npm run build`.
- Branch, then a pull request into `main`. Production deploys only after the owner's approval.
