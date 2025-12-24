# Implementation Plan

## Architecture

```
[project]/
├── apps/
│   ├── web/         # Frontend application
│   ├── api/         # Backend API
│   └── bot/         # Bot/CLI (if applicable)
├── packages/
│   └── core/        # Shared types, utils, business logic
└── supabase/        # Database migrations (if using Supabase)
```

### Key Principles
- Shared code in `packages/core/`
- Each app is independently deployable
- Types defined once, imported everywhere

---

## Build Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | Foundation | |
| 2 | Core Feature | |
| 3 | Enhancement | |

---

## Phase 1: Foundation

**Goal:** Set up project structure and basic functionality.

### Deliverables
- [ ] Initialize monorepo with pnpm workspaces
- [ ] Set up `packages/core/` with shared types
- [ ] Configure TypeScript paths
- [ ] Set up database (if applicable)
- [ ] Basic authentication

### Code Patterns

```typescript
// packages/core/src/types.ts
export interface User {
  id: string
  email: string
  created_at: string
}

// packages/core/src/index.ts
export * from "./types"
export * from "./utils"
```

---

## Phase 2: Core Feature

**Goal:** Build the primary functionality.

### Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2
- [ ] Deliverable 3

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| `docs/plans/ROADMAP.md` | Priority queue and feature planning |
| `docs/plans/IMPLEMENTATION.md` | Technical build guide (this file) |
| `docs/specs/` | Feature specifications |
| `docs/knowledge/` | Reference patterns |
