# Pantheon

Read-only control dashboard for multi-agent software projects. It shows the task board, pending approvals, session names and token costs for any project that keeps its agent state in markdown tables.

It makes no model calls. Opening it costs no tokens.

## How it works

```
project repo (docs/agents/*.md)  →  GitHub API (read-only token, cached 60 s)
                                   →  adapter (markdown tables → typed model, validated)
                                   →  Board · Task · Approvals · Costs · Health
```

The markdown format is the contract. See [docs/FORMAT.md](docs/FORMAT.md). Projects are listed in [`pantheon.config.json`](pantheon.config.json); adding one is a config entry, not a code change (the `sample` project proves it).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run test:run     # parser, validation, naming, source tests
npm run typecheck
npm run lint
npm run build
```

Without `GITHUB_READ_TOKEN` it shows the bundled fixture snapshot under `fixtures/`, with a visible banner. With the token it reads the live repo. Copy `.env.example` to `.env.local` to set one.

## Add a project

1. Add an entry to `pantheon.config.json`: id, name, source (`github` repo and branch, or `fixtures` directory), the paths of the board, approvals and usage files, and the session and branch naming patterns.
2. Make sure its files follow [docs/FORMAT.md](docs/FORMAT.md).
3. Give the read token access to that repo.

## What it deliberately does not do

- It never writes to a project. Decisions stay in the project's approvals file.
- It cannot start sessions. Each task page generates a brief to paste into a new session.
- It stores nothing. There is no database.

## Deploy (Vercel)

Import the repo as a Vercel project (framework: Next.js, no custom build command). Set `GITHUB_READ_TOKEN` in the environment (fine-grained, contents: read, only the tracked repos). Turn on Vercel Authentication so only the owner can open it.
