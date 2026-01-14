# Type Sync Check

## When to Use

- After adding fields to database tables
- When modifying API response shapes
- Before deploying changes that touch types
- When build fails with type errors

## Common Sync Points

If your monorepo uses shared types (examples below):

- `packages/core/src/types.ts` - source of truth
- `apps/web/src/lib/database.types.ts` - generated or duplicated types
- `apps/api/src/types/` - should import from core

## Supabase Pattern

After schema changes:

```bash
supabase gen types typescript --local > packages/core/src/database.types.ts
```

## Validation Steps

1. Identify the source of truth for types
2. Check all consumers import from source
3. If duplicated, verify they match
4. Run `pnpm typecheck` to validate

## Red Flags

- Types defined in multiple places
- Different field names for the same data
- Missing optional markers on nullable fields
- Enums not matching database values
