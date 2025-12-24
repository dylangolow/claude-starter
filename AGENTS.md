# AGENTS.md

> Cross-tool context file for AI coding agents. Works with Claude Code, Copilot, Cursor, Codex, Jules, and others.

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
    └── specs/             # Feature specifications
```

## Setup

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build
pnpm build

# Run tests
pnpm test
```

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
- Routes in `apps/api/src/routes/`
- Error handling via shared helpers
- Consistent logging format

### Frontend Patterns
- React Query for data fetching
- Mobile-first responsive design
- Component library in `components/ui/`

## Database

- Migrations in `supabase/migrations/`
- Migration-first development:
  1. Create migration file first
  2. Apply locally to test
  3. Build feature against schema
  4. Push to remote when verified

## Deployment

```bash
pnpm deploy:api       # Deploy API
pnpm deploy:web       # Deploy frontend
```

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL` - Database connection
- `API_KEY` - External service key

## PR Guidelines

- Run `pnpm lint && pnpm test` before commits
- Descriptive commit messages
- One feature per PR