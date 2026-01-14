# Deployment Checklist

## Pre-flight Checks

Before deploying, verify:

1. Git status clean
2. Correct cloud account selected
3. Build passes
4. On main branch (or confirm deploying from a feature branch)

```bash
git status --porcelain
```

## Deploy Commands

Use repo scripts where available:

```bash
pnpm deploy:api
pnpm deploy:web
```

## Parallel Deployment

```bash
pnpm deploy:api & pnpm deploy:web & wait
```

## Post-Deploy Verification

- Check service status endpoints
- Verify key user flows
- Confirm logs/metrics for errors

## Rollback

Keep rollback steps documented per platform (Cloud Run, Vercel, etc.).

## Cost Check

After major changes, check for orphaned resources and deprecated services.
