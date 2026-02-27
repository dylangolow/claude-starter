# Codex Context

> Codex-specific workflow guidance. See `AGENTS.md` for cross-tool project context (setup, structure, safety rules).
>
> **Important**: Codex does not read `CLAUDE.md`. Any cross-tool rules belong in `AGENTS.md` so both tools see them.

## Start of Session

1. Read `AGENTS.md` for project overview, commands, and safety rules
2. Read `docs/plans/ROADMAP.md` for priorities
3. Read `docs/plans/IMPLEMENTATION.md` for current phase

## Before Building

- Read the relevant `docs/specs/*.md` for requirements

## Planning Approach

- For small tasks: proceed directly.
- For medium/large tasks: propose a short plan (3-6 steps) and track progress in `docs/plans/IMPLEMENTATION.md` or the relevant spec.

## Protected Files

Do not modify without explicit confirmation:
- `docs/plans/ROADMAP.md` - Priority queue
- `docs/plans/IMPLEMENTATION.md` - Technical build guide
- `docs/specs/*.md` - Feature specifications

## Deployment

```bash
# Deploy (update commands per project)
pnpm deploy:api
pnpm deploy:web
```

Always confirm with user before deploying.

## End of Session

- Update deliverable checkboxes with user confirmation
