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
- `AGENTS.md` - Ask before replacing
- `CLAUDE.md` - Ask before replacing
- `package.json` - Merge or replace?
- `docs/` - Preserve existing content?
- `.claude/` - Preserve existing agents/skills?

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

Based on answers, generate the following:

#### 1. Create `AGENTS.md` (Cross-tool context)

Fill in based on answers:
- Project Overview (one-liner)
- Structure section (monorepo vs standalone)
- Setup commands for chosen stack
- Code style (keep defaults unless specified)
- Database section (if applicable)
- Deployment commands (if known)

This file works with any AI coding tool (Copilot, Cursor, Codex, Jules, etc.)

#### 2. Create `CLAUDE.md` (Claude-specific)

Keep the template structure, customize:
- Remove irrelevant sections
- Add project-specific safety rules if needed
- Reference any custom agents/skills to be created

#### 3. Create `.claude/` directory structure

```
.claude/
├── agents/
│   └── .gitkeep
└── skills/
    └── .gitkeep
```

#### 4. Create `docs/plans/ROADMAP.md`
- Add Phase 1 based on project type
- Include relevant features in backlog

#### 5. Create `docs/plans/IMPLEMENTATION.md`
- Architecture diagram for chosen structure
- Phase 1 deliverables based on stack

#### 6. Create `package.json` (if monorepo)
- Workspace configuration
- Common scripts

#### 7. Create `pnpm-workspace.yaml` (if monorepo)
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### 8. Update `.gitignore`
- Ensure `context/` is ignored
- Ensure `.claude/` agents/skills are committed (NOT ignored)
- Add stack-specific ignores

---

## Post-Init Summary

After generating files, provide:

1. **Summary of what was created**
   - `AGENTS.md` - Cross-tool project context
   - `CLAUDE.md` - Claude-specific configuration
   - `.claude/` - Directory for agents and skills
   - `docs/plans/` - Planning documents

2. **Recommended next steps**, e.g.:
   - `pnpm install`
   - `supabase init` (if using Supabase)
   - Create first spec in `docs/specs/`
   - Set up environment variables

3. **Offer to help with first task**
   - "Want me to create the initial package structure?"
   - "Should I set up the API scaffold?"
   - "Want me to create a custom subagent for [workflow]?"

---

## Stack-Specific Patterns

### Telegram Bot Project

If user selected Telegram bot, include in `AGENTS.md`:
```markdown
## Bot Patterns
- Use grammy library (better TypeScript support than telegraf)
- Commands in `apps/bot/src/commands/`
- Conversations in `apps/bot/src/conversations/`
- Use webhook mode in production, polling in dev
```

Reference `docs/knowledge/telegram-bots.md` for setup details.

### Supabase Project

If user selected Supabase, include in `AGENTS.md`:
```markdown
## Database (Supabase)
- Migrations in `supabase/migrations/`
- Migration-first development (create migration before code)
- Edge Functions for external API calls
```

### AI/LLM Integration

If user selected AI features, include in `AGENTS.md`:
```markdown
## AI Patterns
- Use Anthropic SDK for Claude
- Track token usage for cost monitoring
- Implement rate limiting
- Consider streaming for long responses
```

---

## Custom Agents & Skills

### When to Suggest Creating an Agent

Suggest a custom subagent when user has:
- A repeated review/validation workflow
- A specialized domain (security audit, performance review)
- A multi-step process that benefits from focused context

Example prompt:
> "Since you'll be doing [X] frequently, want me to create a custom subagent for it?"

### When to Suggest Creating a Skill

Suggest a skill when:
- A workflow is repeated 3+ times
- There are specific steps Claude should follow autonomously
- Domain expertise can be codified

Example prompt:
> "This deployment workflow has several steps. Want me to create a skill so I handle it automatically next time?"

---

## Knowledge Base References

Point users to relevant docs based on their choices:

| Choice | Knowledge Doc |
|--------|--------------|
| Telegram bot | `docs/knowledge/telegram-bots.md` |
| Monorepo | `docs/knowledge/monorepo-setup.md` |
| Supabase | `docs/knowledge/supabase-edge-functions.md` |
| Claude features | `docs/knowledge/claude-code-features.md` |

---

## File Relationship Summary

```
project/
├── AGENTS.md              # Cross-tool: setup, structure, commands
├── CLAUDE.md              # Claude: safety, workflow, tool prefs
├── .claude/
│   ├── agents/            # Custom subagents (YAML frontmatter + prompt)
│   └── skills/            # Project skills (SKILL.md + supporting files)
├── docs/
│   ├── plans/             # ROADMAP.md, IMPLEMENTATION.md
│   ├── specs/             # Feature specifications
│   └── knowledge/         # Reusable patterns
└── context/               # Ephemeral files (gitignored)
```