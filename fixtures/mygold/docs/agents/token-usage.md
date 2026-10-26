# Token and cost usage of the multi-agent workflow

Measured 2026-10-25 09:40 UTC, from the main session's transcript and the sessions' own reported usage. Dollar figures are the sessions' reported costs; the split by turn type is an estimate (within about 10%).

## Totals (about 36 hours)
| What | Cost | Notes |
|---|---|---|
| Main session, including its 26 subagent runs | $65.31 reported | 423+ calls, context now 565k tokens (peak 779k before compaction) |
| of which subagent runs | ~$14.5 | 26 runs, ~$0.55 each; 13 were code-review runs (~$5 total) |
| of which main thread | ~$51 | coordination, setup, dashboard build, PRs |
| Standing agent sessions (separate) | ~$2.6 | Code reviewer $1.90 (4 jobs), Frontend $0.29+, one question session $0.38 |
| Other sessions on the account, for comparison | $0.2 to $8 each | the largest of them cost $7.96 |

## Where the main thread's money goes
- **Cache reads 58%, cache writes 29%, output 12%.** Output is under 1% of all tokens. You mostly pay for the model re-reading its own context on every turn.
- Context averaged 360k to 460k tokens per call, so a one-line relay costs about $0.10 and an ordinary turn about $0.14.
- **Comment/notification wake turns: 207 of 423 calls, about 41% of main-thread cost (~$21).** Most were relays or confirmations.
- By phase (main thread): setup, discovery and fixes ~$22; dashboard design and build ~$16; routing, go-aheads and reviews ~$12.
- Subagent cold start is only ~7% of subagent cost, so spawning is not the problem.

## What the workflow bought
Reviews blocked real defects before merge: T-008 (two rounds, cache leaks of non-public products), T-009 (moderation filter blocked 33 of 82 legitimate texts), T-010 (Cache-Control bypass), T-024 (raw Stripe/database error text shown to buyers). QA tests found four payment inconsistencies (A-010). Five live bugs were fixed on dev.

## Optimization plan (largest saving first)
1. **Lean coordinator.** Replace the 565k-token main session with a fresh one that starts at ~90k tokens (all state is in the docs and the dashboard). A relay turn drops from ~$0.10 to ~$0.02.
2. **Keep large files out of the coordinator.** Dashboard changes go to a dedicated builder session, not the coordinator.
3. **Free status answers.** Status questions answered from stored task data, with no model call; asking an agent is only for a fresh investigation.
4. **Tiered review.** Docs and comments: no reviewer. Small non-sensitive code: Sonnet reviewer. Money, auth, data, schema: Opus reviewer.
5. **Batch.** One message per agent for several go-aheads; avoid self-scheduled check-ins when an event will do.
6. **Recycle standing sessions** when their context passes ~300k tokens.
