# Pre-Commit Checks

Run validation checks before committing.

## Checks (in order)

### 1. Format Check

```bash
pnpm format:check
```

Auto-fix:

```bash
pnpm format
```

### 2. Lint

```bash
pnpm lint
```

Auto-fix:

```bash
pnpm lint --fix
```

### 3. Type Check

```bash
pnpm typecheck
```

### 4. Build

```bash
pnpm build
```

## Quick Commands

### Check only (no fixes)

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm build
```

### With auto-fix

```bash
pnpm format && pnpm lint --fix && pnpm typecheck && pnpm build
```

## Common Issues

### Type errors after adding fields

Update the shared types and any generated client types.

### Build order issues

If packages depend on a core library, build core first.

### Format conflicts

If format fails on files you did not change, format only staged files.
