# AGENTS.md

> Cross-tool context file for AI coding agents. Works with Claude Code, Copilot, Cursor, Codex, Jules, and others.

## Project Overview

[One-liner describing what this project does]

## Structure

```
[project]/
├── apps/                    # Deployable applications
│   ├── web/                # Frontend (React, Next.js, etc.)
│   ├── api/                # Backend API
│   └── bot/                # Telegram bot, CLI, etc.
│
├── packages/               # Shared libraries
│   └── core/              # Shared types, utils, business logic
│
├── supabase/              # Database (if using Supabase)
│   ├── migrations/
│   └── functions/         # Edge Functions
│
├── docs/                  # Documentation
│   ├── plans/             # ROADMAP.md, IMPLEMENTATION.md
│   ├── specs/             # Feature specifications
│   ├── analytics/         # Event tracking docs
│   └── knowledge/         # Reusable reference patterns
│
├── .github/               # Dependabot, CI workflows
│   └── dependabot.yml
├── .mcp.json              # MCP server config (gitignored)
└── context/               # Ephemeral files (gitignored)
```

## Setup

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build
pnpm build

# Lint / types
pnpm lint
pnpm typecheck
```

## Session Workflow

- Start: read `AGENTS.md`, then `docs/plans/ROADMAP.md` and `docs/plans/IMPLEMENTATION.md`
- Before building: read the relevant `docs/specs/*.md`
- End: update deliverable checkboxes with user confirmation

## Planning

- For small tasks, proceed directly.
- For medium/large tasks, propose a short plan and track progress in `docs/plans/IMPLEMENTATION.md` or the relevant `docs/specs/*.md`.

## Code Style

- TypeScript strict mode
- Double quotes for strings
- 2-space indentation
- Async/await over .then() chains
- Explicit error handling

## Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
```

## Architecture Notes

### Type System
- Core types in `packages/core/src/types.ts` - source of truth
- When adding fields, update core package first

### API Patterns
- Routes in `apps/api/src/routes/` (or `apps/web/src/app/api/` for Next.js)
- Error handling via shared helpers
- Consistent logging format

### Frontend Patterns
- Mobile-first responsive design
- Component library in `components/ui/`

## Database

- Migrations in `supabase/migrations/`
- Migration-first development:
  1. Create migration file first
  2. Apply locally to test
  3. Build feature against schema
  4. Push to remote when verified

## Safety Rules

These apply to all AI tools working in this repo:

### Git Safety
- Never `git push --force` without explicit user confirmation
- Use `git restore --staged <file>` to unstage (not `git reset`)
- Never `git reset --hard` without confirmation
- Always confirm before pushing or destructive actions

### Database Safety
- Never run destructive commands (`db reset`, `drop table`) without asking
- Confirm before pushing migrations to remote
- Never delete `.env` files

### Environment Variables
- Never commit secrets or `.env` files
- Reference `.env.example` for required variables (see below)

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL` - Database connection
- `API_KEY` - External service key

## Deployment

```bash
pnpm deploy:api       # Deploy API
pnpm deploy:web       # Deploy frontend
```

## PR Guidelines

- Run `pnpm lint && pnpm typecheck` before commits
- Descriptive commit messages (conventional format: `type(scope): description`)
- One feature per PR
