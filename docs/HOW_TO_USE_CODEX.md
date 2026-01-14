# How to Use Codex Effectively

A template approach for getting consistent, context-aware AI assistance in your codebase.

## Setup

### 1. Create `AGENTS.md` in project root

This is your project's cross-tool "brain dump". Include:

````markdown
# Project Name - Agent Context

## Project Overview
One-liner describing what this is.

## Structure
Key directories and what they contain.

## Key Commands
```bash
# Development
pnpm dev

# Build & Validate (run before committing)
pnpm build
pnpm typecheck
pnpm test
```

## Patterns
- How data flows (hooks, API, database)
- Component conventions
- Error handling approach

## Type System
Where types live, any gotchas (e.g., "update both X and Y when adding fields")

## Local Development
URLs, test accounts, environment setup.
````

### 2. Create `CODEX.md` (optional but recommended)

Use this file to give Codex a consistent session workflow:

````markdown
# Codex Context

## Start of Session
1. Read AGENTS.md
2. Read docs/plans/ROADMAP.md
3. Read docs/plans/IMPLEMENTATION.md

## Before Building
- Read the relevant docs/specs/*.md

## Planning
- For medium/large tasks, propose a short plan and track progress in docs/plans/IMPLEMENTATION.md
````

### 3. Create `docs/plans/` for planning docs

```
docs/plans/
  ROADMAP.md          # What to build (priority queue)
  IMPLEMENTATION.md   # How to build it (technical guide)
```

#### When to use each file

| File | Purpose | Audience | Use When |
|------|---------|----------|----------|
| **ROADMAP.md** | Strategic - what to build | You, stakeholders | Planning sessions, prioritizing, quick status |
| **IMPLEMENTATION.md** | Tactical - how to build it | Developers, Codex | Starting a phase, referencing architecture |

They complement each other: ROADMAP = strategic decisions, IMPLEMENTATION = tactical execution.

---

**ROADMAP.md** template:

````markdown
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
````

**IMPLEMENTATION.md** template:

````markdown
# Implementation Plan

## Architecture
System diagram and key principles.

## Build Phases
| Phase | Name | Status |
|-------|------|--------|
| 1 | Feature A | Done |
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
````

### 4. Create `docs/specs/` for specs

Specs cover features, infrastructure, fixes, and any other technical design docs:

```
docs/specs/
  billing.md          # Feature spec
  error-tracking.md   # Infrastructure spec
  auth.md             # Feature spec
```

### 5. Create `context/` for ephemeral files (gitignored)

For call transcripts, meeting notes, research, and temporary checklists that shouldn't be committed:

```
context/
  call-2025-01-15-client-feedback.md
  meeting-notes-kickoff.md
  research-competitor-analysis.md
```

**IMPORTANT**: Add to `.gitignore` - context files are never committed:

```gitignore
# Ephemeral context files (never committed)
context/
```

## Usage Patterns

### Starting a session

Point Codex to the core docs:
> "Read AGENTS.md, then docs/plans/IMPLEMENTATION.md, then the relevant docs/specs/*.md"

### During work

- Ask for confirmation before modifying planning/spec docs
- Keep plans short and track progress in docs

### Ending a session

> "Update the implementation doc with what we completed"
