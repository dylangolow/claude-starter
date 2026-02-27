# Security Hardening

Patterns for setting up dependency scanning and security automation.

## Dependabot

### Setup Checklist

1. Create `.github/dependabot.yml` in the repo root
2. Add an entry for each package ecosystem in use
3. Add `github-actions` ecosystem (even if no workflows exist yet)
4. Group minor + patch updates; keep major updates separate
5. Set `open-pull-requests-limit` (10 for npm, 5 for actions)

### Configuration Template

```yaml
version: 2

updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
```

### Monorepo Handling

Add a separate entry for each workspace with its own `package.json`:

```yaml
- package-ecosystem: "npm"
  directory: "/"           # root
- package-ecosystem: "npm"
  directory: "/apps/web"   # workspace
- package-ecosystem: "npm"
  directory: "/packages/core"
```

Reference: `pnpm-workspace.yaml` or `workspaces` field in root `package.json`.

### Supported Ecosystems

| Ecosystem | Use When |
|-----------|----------|
| `npm` | Node.js / pnpm / yarn |
| `github-actions` | Any repo with workflows |
| `docker` | Repos with Dockerfile |
| `pip` | Python projects |
| `gomod` | Go modules |
| `cargo` | Rust projects |

### Grouping Strategy

- **Group minor + patch**: Reduces PR noise, safe to batch
- **Separate major updates**: Breaking changes need individual review
- **Schedule on Monday**: Batches updates at start of week
