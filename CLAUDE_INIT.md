# Claude Initialization Guide

This file guides the `/init` process. Reference this when helping users set up a new project from this template.

## Pre-flight Checks

Before starting initialization, verify:

### 1. Git Status
```bash
git status
```
- If "not a git repository": Ask user if they want to `git init`
- If already initialized: Proceed

### 2. Existing Files
Check for files that might be overwritten:
- `CLAUDE.md` - Ask before replacing
- `package.json` - Merge or replace?
- `docs/` - Preserve existing content?

### 3. Working Directory
Confirm this is the intended project root.

---

## Initialization Flow

### Step 1: Project Basics

Ask:
- "What are you building?" (one-liner for Project Overview)
- "Project name?" (for package.json name field)

### Step 2: Architecture

Ask: "Monorepo or standalone?"

**Monorepo** (recommended for multi-component systems):
```
project/
├── apps/           # Deployable applications
│   ├── web/       # Frontend
│   ├── api/       # Backend
│   └── bot/       # Telegram bot, CLI, etc.
├── packages/       # Shared code
│   └── core/      # Types, utils, business logic
└── docs/
```

**Standalone** (simpler, single-purpose):
```
project/
├── src/
├── docs/
└── package.json
```

### Step 3: Tech Stack

Ask about each layer:

**Frontend** (if applicable):
- React + Vite (recommended)
- Vue
- Svelte
- None

**Backend** (if applicable):
- Node + Express
- Node + Hono
- Edge Functions only
- None

**Database**:
- Supabase (recommended - Auth + Postgres + Edge Functions)
- Firebase
- Raw Postgres
- MongoDB
- None yet

**Deployment**:
- Cloud Run (recommended for APIs/bots)
- Vercel (recommended for frontends)
- Firebase Hosting
- Railway
- None yet

### Step 4: Planned Features

Ask: "Any of these planned?" (helps include relevant knowledge docs)

- [ ] Telegram bot
- [ ] AI/LLM integration (Claude, OpenAI)
- [ ] Auth system
- [ ] Payments/billing
- [ ] Real-time features (WebSockets, subscriptions)
- [ ] File uploads/storage

### Step 5: Generate Files

Based on answers, generate:

1. **Update `CLAUDE.md`**
   - Fill in Project Overview
   - Adjust Structure section
   - Update Commands for chosen stack
   - Remove irrelevant sections

2. **Create `docs/plans/ROADMAP.md`**
   - Add Phase 1 based on project type
   - Include relevant features in backlog

3. **Create `docs/plans/IMPLEMENTATION.md`**
   - Architecture diagram for chosen structure
   - Phase 1 deliverables based on stack

4. **Create `package.json`** (if monorepo)
   - Workspace configuration
   - Common scripts

5. **Create `pnpm-workspace.yaml`** (if monorepo)
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```

6. **Update `.gitignore`**
   - Ensure `context/` is ignored
   - Add stack-specific ignores

---

## Post-Init Summary

After generating files, provide:

1. **Summary of what was created**
2. **Recommended next steps**, e.g.:
   - `pnpm install`
   - `supabase init` (if using Supabase)
   - Create first spec in `docs/specs/`
   - Set up environment variables

3. **Offer to help with first task**
   - "Want me to create the initial package structure?"
   - "Should I set up the Telegram bot scaffold?"

---

## Stack-Specific Patterns

### Telegram Bot Project

If user selected Telegram bot, include in CLAUDE.md:
```markdown
## Bot Patterns
- Use grammy library (better TypeScript support than telegraf)
- Commands in `apps/bot/src/commands/`
- Conversations in `apps/bot/src/conversations/`
- Use webhook mode in production, polling in dev
- Share business logic via `@[project]/core`
```

Reference `docs/knowledge/telegram-bots.md` for setup details.

### Supabase Project

If user selected Supabase, include:
```markdown
## Database (Supabase)
- Migrations in `supabase/migrations/`
- **Migration-first development**:
  1. Start features with migration files
  2. Apply locally with `supabase migration up`
  3. Test end-to-end locally
  4. Confirm before `supabase db push`
```

### AI/LLM Integration

If user selected AI features, include:
```markdown
## AI Patterns
- Use Anthropic SDK for Claude
- Track token usage for cost monitoring
- Implement rate limiting
- Consider streaming for long responses
```

---

## Knowledge Base References

Point users to relevant docs based on their choices:

| Choice | Knowledge Doc |
|--------|--------------|
| Telegram bot | `docs/knowledge/telegram-bots.md` |
| Monorepo | `docs/knowledge/monorepo-setup.md` |
| Supabase | `docs/knowledge/supabase-patterns.md` |
| Cloud Run | `docs/knowledge/cloud-run-deploy.md` |
