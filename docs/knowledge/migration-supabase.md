# Supabase Migration Workflow

## When to Use

- Creating new tables or columns
- Modifying existing schema
- Adding indexes, constraints, or policies
- Any Supabase migration work

## Migration-First Development

1. Create migration file before writing other code
2. Apply locally with `supabase migration up`
3. Build and test end-to-end locally
4. Confirm before pushing to remote

## Create Migration

```bash
supabase migration new <descriptive_name>
```

Creates: `supabase/migrations/<timestamp>_<name>.sql`

## Write Migration SQL

- Add DDL in the new migration file
- Add RLS policies if creating tables
- Add rollback comments if complex

## Apply Locally

```bash
supabase migration up
```

Never use `supabase db reset` without explicit confirmation.

## Check Status

```bash
supabase migration list
```

## Push to Remote

```bash
supabase db push
```

Always confirm before pushing to remote.

## Common Patterns

### Add Column

```sql
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS new_field text;
```

### Add Table with RLS

```sql
CREATE TABLE public.new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own records"
  ON public.new_table FOR ALL
  USING (auth.uid() = user_id);
```

### Add Index

```sql
CREATE INDEX IF NOT EXISTS idx_table_column
ON public.table_name(column_name);
```

## Type Updates

After schema changes, update shared types and any generated client types.

## Troubleshooting

### Migration failed locally

```bash
supabase db logs
```

### Connect to local DB

```bash
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres
```

### Out of sync with remote

```bash
supabase db pull
supabase migration list
```
