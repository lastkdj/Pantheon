# CLAUDE.md

Pantheon is a small read-only Next.js dashboard. Keep it that way.

- Read-only: never write to a tracked project, never call a model.
- The markdown format in `docs/FORMAT.md` is the contract. Change parsing only with a test against `fixtures/`.
- Reuse comes from `pantheon.config.json`. Do not hardcode a project name or path in code.
- Never print or commit `GITHUB_READ_TOKEN` or any secret. `.env*` stays untracked.
- UI is Pantheon's own design: palette sampled from the owner's reference (deep indigo panels, electric violet, blue and teal tiles, one hot-pink action, lavender canvas), Sora headings, Plus Jakarta Sans body. Tokens live in `tailwind.config.ts`. Do not import another product's design system. Every animation must stop under `prefers-reduced-motion`.
- Before pushing: `npm run test:run`, `npm run typecheck`, `npm run lint`, `npm run build`.
- Branch, then a pull request into `main`. Production deploys only after the owner's approval.
