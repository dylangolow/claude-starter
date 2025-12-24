# [Project Name] - Claude Context

## Project Overview
[One-liner describing what this project does]

## Structure
```
[project]/
├── apps/                    # Deployable applications
│   ├── web/                # Frontend (React, Vue, etc.)
│   ├── api/                # Backend API
│   └── bot/                # Telegram bot, CLI, etc.
│
├── packages/               # Shared libraries
│   └── core/              # Shared types, utils, business logic
│
├── supabase/              # Database (if using Supabase)
│   └── migrations/
│
└── docs/                  # Documentation
    ├── plans/             # ROADMAP.md, IMPLEMENTATION.md
    ├── specs/             # Feature and infra specs
    └── knowledge/         # Reference patterns
```

## Key Commands
```bash
# Development
pnpm dev              # Run dev server
pnpm dev:all          # Run all apps in parallel

# Build & Validate
pnpm build            # Build all packages
pnpm typecheck        # Type check without building

# Deploy
pnpm deploy:api       # Deploy API
pnpm deploy:web       # Deploy frontend
```

## Type System
- **Core types**: `packages/core/src/types.ts` - source of truth
- **IMPORTANT**: When adding fields, update types in core package first

## Database
- Migrations in `supabase/migrations/`
- **Never run `supabase db reset`** without asking first - destroys local data
- **Migration-first development**:
  1. Start features with migration files before other code
  2. Apply locally with `supabase migration up` to test
  3. Build and test end-to-end locally
  4. Confirm before pushing to remote (`supabase db push`)

## API Patterns
- Routes in `apps/api/src/routes/`
- Use `createLogger()` from `@[project]/core` for logging
- Error handling via `createError()` helper

## Frontend Patterns
- React Query for data fetching
- Shadcn UI components in `components/ui/`
- Mobile-first responsive: use `sm:`, `md:`, `lg:` prefixes

## Local Development
- Web: `localhost:5173`
- API: `localhost:3000`
- Database: `localhost:54321` (Supabase local)

## Performance Tips
- **Parallel deployments**: Run deploy commands simultaneously
- **Parallel tool calls**: Batch independent operations
- **Background tasks**: Long-running builds can run in background

## Git Safety
- Never `git push --force` without explicit confirmation
- Use `git restore --staged <file>` to unstage (not `git reset`)
- Never `git reset --hard` without confirmation - destroys uncommitted changes
- Always confirm before pushing or destructive actions

## Cloud Cost Optimization
After deploying consolidated services, suggest cleanup of:
- Replaced Cloud Run services
- Unused Artifact Registry images
- Deprecated build triggers

## Context Files
- **context/**: Ephemeral files (call transcripts, meeting notes, research)
- **NEVER committed** - gitignored
- For permanent checklists, add to `docs/specs/*.md`

## Protected Files
- **docs/**: Don't modify without confirmation
  - `docs/plans/ROADMAP.md` - Priority queue
  - `docs/plans/IMPLEMENTATION.md` - Technical build guide
  - `docs/specs/` - Feature specs

## Session Context
- **Start**: Check `docs/plans/ROADMAP.md` and `docs/plans/IMPLEMENTATION.md`
- **Before building**: Read relevant `docs/specs/*.md`
- **End**: Update deliverable checkboxes (with confirmation)

## Tool Preferences
- Prefer CLI commands over MCP tools when both are available (more reliable, consistent auth)
- Use project's package manager based on lockfile (pnpm-lock.yaml, package-lock.json, yarn.lock)
- **Edge Functions over pg_net**: For webhooks, notifications, and external API calls, prefer TypeScript Edge Functions over PostgreSQL pg_net triggers. Edge Functions provide better observability, logging, error handling, and are easier to debug.

## Updating This File
Keep CLAUDE.md fresh as the project evolves:
- **New patterns**: Add gotchas, conventions discovered during development
- **New commands**: Document build/deploy/test commands as they're added
- **Deprecated info**: Remove or update outdated sections
- **Knowledge docs**: Move reusable patterns to `docs/knowledge/` for reference across projects

## Knowledge Base
Reference `docs/knowledge/` for common patterns:
- `telegram-bots.md` - Bot setup, grammy, webhooks
- `monorepo-setup.md` - pnpm workspaces, shared packages
