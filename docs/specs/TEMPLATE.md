# Feature: [Name]

> One-line summary of what this feature does.

## Status

- **Phase**: [Planning | In Progress | Complete]
- **Spec Owner**: [name]

## Goal

What problem does this solve? What user need does it address?

## Requirements

### Must Have
- [ ] Requirement 1
- [ ] Requirement 2

### Nice to Have
- [ ] Optional enhancement

## Design

### Data Model

New tables or columns needed:

```sql
-- Example
CREATE TABLE public.feature_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.feature_table ENABLE ROW LEVEL SECURITY;
```

### API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/feature` | List items |
| POST | `/api/feature` | Create item |

### UI

Key screens or components affected.

## Edge Cases

- What happens when [X]?
- How does this interact with [Y]?

## Testing

- [ ] Unit tests for core logic
- [ ] API route tests
- [ ] Manual smoke test checklist

## Open Questions

- [ ] Unresolved decision 1
- [ ] Unresolved decision 2
