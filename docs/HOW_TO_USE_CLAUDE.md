# How to Use Claude Code Effectively

A template approach for getting consistent, context-aware AI assistance in your codebase.

## Setup

### 1. Create `CLAUDE.md` in project root

This is your project's "brain dump" for Claude. Include:

```markdown
# Project Name - Claude Context

## Project Overview
One-liner describing what this is.

## Structure
Key directories and what they contain.

## Key Commands
```bash
# Development
pnpm dev          # Local development

# Build & Validate (run before committing)
pnpm build        # Build all
pnpm typecheck    # Type check only
pnpm test         # Run tests

# Deploy (run in parallel to save time)
pnpm deploy:api   # Deploy API
pnpm deploy:web   # Deploy frontend
```

## Patterns
- How data flows (hooks, API, database)
- Component conventions
- Error handling approach

## Type System
Where types live, any gotchas (e.g., "update both X and Y when adding fields")

## Local Development
URLs, test accounts, environment setup.
```

### 2. Create `docs/plans/` for planning docs

```
docs/plans/
  ROADMAP.md          # What to build (priority queue)
  IMPLEMENTATION.md   # How to build it (technical guide)
```

#### When to use each file

| File | Purpose | Audience | Use When |
|------|---------|----------|----------|
| **ROADMAP.md** | Strategic - what to build | You, stakeholders | Planning sessions, prioritizing, quick status |
| **IMPLEMENTATION.md** | Tactical - how to build it | Developers, Claude | Starting a phase, referencing architecture |

**ROADMAP.md** is your product brain:
- Priority queue of upcoming features
- High-level descriptions with user benefits
- Backlog of future ideas
- Quick scan for "what's next?"

**IMPLEMENTATION.md** is your technical brain:
- System architecture diagrams
- Code patterns and examples to copy
- Detailed deliverables with checkboxes
- Phase-by-phase build guide

They complement each other: ROADMAP = strategic decisions, IMPLEMENTATION = tactical execution.

---

**ROADMAP.md** template:

```markdown
# Roadmap

## Priority Queue
Features in priority order with brief descriptions.

### Feature Name
- What it does and why it matters
- Key capabilities

## Backlog
Lower priority items for later.

## Completed
Shipped features for reference.
```

**IMPLEMENTATION.md** template:

```markdown
# Implementation Plan

## Architecture
System diagram and key principles.

## Build Phases
| Phase | Name | Status |
|-------|------|--------|
| 1 | Feature A | ✅ Done |
| 2 | Feature B | In Progress |

## Phase N: [Name]
**Goal:** What this phase accomplishes.

### Deliverables
- [ ] Task 1
- [ ] Task 2
- [x] Task 3 (completed)

### Code Patterns
```typescript
// Example patterns for this phase
```
```

### 3. Create `docs/specs/` for specs

Specs cover features, infrastructure, fixes, and any other technical design docs:

```
docs/specs/
  billing.md          # Feature spec
  error-tracking.md   # Infrastructure spec
  auth.md             # Feature spec
```

**Example spec** (`docs/specs/billing.md`):

```markdown
# Spec: Billing & Usage Tracking

## Overview
Stripe subscriptions with AI token usage tracking.

## Requirements
- [ ] User tiers (Free, Pro, Beta)
- [ ] Token usage tracking per model
- [ ] Stripe checkout integration

## Technical Approach
- API: `/api/billing/*`, `/api/usage`
- Database: `ai_usage` table, user billing columns
- UI: UsageMeter component, upgrade prompts

## Deliverables
- [ ] Database migration
- [ ] Stripe webhook handler
- [ ] Usage limits middleware
```

### 4. Create `context/` for ephemeral files (gitignored)

For call transcripts, meeting notes, research, and temporary checklists that shouldn't be committed:

```
context/
  call-2025-01-15-client-feedback.md
  meeting-notes-kickoff.md
  research-competitor-analysis.md
  setup-checklist-stripe.md         # Temp setup notes
```

**IMPORTANT**: Add to `.gitignore` - context files are never committed:
```gitignore
# Ephemeral context files (never committed)
context/
```

These files provide background for Claude but don't belong in version control. For permanent checklists, add them directly to the relevant spec file in `docs/specs/`.

### 5. Add these sections to your `CLAUDE.md`

```markdown
## Context Files
- **context/**: Ephemeral context files (call transcripts, meeting notes, research, temp checklists). **NEVER committed to git**. Add to `.gitignore`. Read for background when planning/implementing. For permanent checklists, add them to the relevant `docs/specs/*.md` file instead.

## Protected Files
- **docs/**: Don't modify without explicit confirmation
  - `docs/README.md` - Project overview
  - `docs/plans/` - Planning docs (ROADMAP.md, IMPLEMENTATION.md)
  - `docs/specs/` - Specs (features, infrastructure, fixes)

## Session Context
- **Start of session**: Check `docs/README.md` for overview, `docs/plans/ROADMAP.md` for big picture, `docs/plans/IMPLEMENTATION.md` for current phase
- **Before building**: Read the relevant `docs/specs/*.md` file for requirements
- **End of session**: Update deliverable checkboxes (with user confirmation)
```

## Usage Patterns

### Starting a session
Claude reads `CLAUDE.md` automatically. For long projects, point to implementation docs:
> "Check docs/plans/IMPLEMENTATION.md and continue where we left off"

### During work
- Claude uses TodoWrite to track tasks
- Ask for confirmation before modifying protected files
- Reference line numbers when discussing code

### Ending a session
> "Update the implementation doc with what we completed"

## Performance Tips

Add a section like this to your CLAUDE.md:

```markdown
## Performance Tips
- **Parallel deployments**: Run `deploy:api` and `deploy:web` in parallel
- **Parallel tool calls**: Batch independent Bash/Read/Grep calls in one message
- **Parallel subagents**: Run multiple Task agents concurrently for search/research
- **Background tasks**: Use `run_in_background` for long builds while continuing work
```

## Cloud Cost Optimization

Add this pattern to your CLAUDE.md to get proactive cost-saving suggestions:

```markdown
## Cloud Cost Optimization
After deploying consolidated services or major infrastructure changes, proactively suggest cleanup of legacy resources:
- Replaced Cloud Run services/jobs
- Unused Artifact Registry images
- Deprecated Cloud Build triggers
- Old revisions and unused indexes

Check current resources: `gcloud run services list --region=us-central1`
```

This ensures Claude reminds you to clean up when you deploy a new unified service that replaces multiple legacy services.

## Tips

1. **Keep CLAUDE.md fresh** - Update it as patterns evolve
2. **Be specific in docs/** - The more context, the less re-explaining
3. **Use protected files** - Prevent accidental overwrites of important docs
4. **Add tool preferences** - Note CLI vs MCP preferences for your stack
5. **Include gotchas** - "Always update both X and Y" saves debugging time
6. **List validation steps** - typecheck, test, build commands to run before commit
7. **Use /init for new repos** - Run `/init` to generate CLAUDE.md for repos missing one
8. **Add cloud cost reminders** - Include cost optimization section to get cleanup suggestions
