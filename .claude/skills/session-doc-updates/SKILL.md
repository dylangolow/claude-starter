---
name: session-doc-updates
description: Reusable workflow to sync session-context updates into docs/plans/IMPLEMENTATION.md, docs/specs/*.md, and docs/knowledge/*.md using a controlled source file with dry-run/apply checks.
allowed-tools: Read, Grep, Bash
---

# Session Doc Updates

## When to Use

- User asks to update docs from session context
- You need to capture implementation progress, durable knowledge, or spec clarifications after coding work

## Install in This Repo (if missing)

Copy the bundled assets:

```bash
mkdir -p scripts
cp .claude/skills/session-doc-updates/assets/apply-session-doc-updates.mjs scripts/
cp .claude/skills/session-doc-updates/assets/session-doc-updates.template.md scripts/
```

Optional package scripts:

```json
{
  "scripts": {
    "docs:session:apply": "node scripts/apply-session-doc-updates.mjs",
    "docs:session:apply:stage": "node scripts/apply-session-doc-updates.mjs --stage"
  }
}
```

## Source File

- Default source file: `context/session-doc-updates.md` (gitignored)
- Template file: `scripts/session-doc-updates.template.md`

Expected source format:

```md
## [docs/plans/IMPLEMENTATION.md]

- Session implementation updates

## [docs/knowledge/<topic>.md]

- Durable learning

## [docs/specs/<feature>.md]

- Requirement clarifications
```

## Guardrails

Only these target paths are valid:

- `docs/plans/IMPLEMENTATION.md`
- `docs/specs/*.md`
- `docs/knowledge/*.md`

Any other path should fail.

## Workflow

1. Confirm docs edits are approved for this request.
2. Ensure source file exists (create from template if needed).
3. Preview changes:
   - `node scripts/apply-session-doc-updates.mjs --dry-run`
   - or `pnpm docs:session:apply --dry-run`
4. Apply updates:
   - `node scripts/apply-session-doc-updates.mjs`
   - or `pnpm docs:session:apply`
5. Summarize exact docs changed and what was added.

## Notes

- Updates are appended under `## Session Context Updates`.
- A stable marker is added for duplicate prevention.
