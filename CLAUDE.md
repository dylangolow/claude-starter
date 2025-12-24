# Claude Code Context

> Claude-specific features and configuration. See `AGENTS.md` for cross-tool project context.

## Quick Reference

| File | Purpose |
|------|---------|
| `AGENTS.md` | Project setup, structure, commands (any AI tool) |
| `CLAUDE.md` | Claude-specific features (this file) |
| `.claude/agents/` | Custom subagents |
| `.claude/skills/` | Project-specific skills |

## Session Workflow

### Start of Session
1. Check `AGENTS.md` for project overview
2. Check `docs/plans/ROADMAP.md` for priorities
3. Check `docs/plans/IMPLEMENTATION.md` for current phase

### Before Building
- Read relevant `docs/specs/*.md` for requirements

### End of Session
- Update deliverable checkboxes (with confirmation)
- Offer to capture learnings as skills/knowledge

## Protected Files

Do not modify without explicit confirmation:
- `docs/plans/ROADMAP.md` - Priority queue
- `docs/plans/IMPLEMENTATION.md` - Technical build guide
- `docs/specs/*.md` - Feature specifications

## Context Files

- **`context/`**: Ephemeral files (transcripts, notes, research)
- **NEVER committed** - gitignored
- For permanent checklists, add to `docs/specs/*.md`

## Git Safety

- Never `git push --force` without explicit confirmation
- Use `git restore --staged <file>` to unstage (not `git reset`)
- Never `git reset --hard` without confirmation
- Always confirm before pushing or destructive actions

## Tool Preferences

- Prefer CLI commands over MCP tools (more reliable auth handling)
- Use project's package manager based on lockfile
- Edge Functions over database triggers for external calls

## Database Safety

- Never run destructive commands (`db reset`, `drop table`) without asking
- Migration-first development (see `AGENTS.md`)
- Confirm before pushing migrations to remote

## Subagents

Custom subagents in `.claude/agents/`:

```markdown
---
name: code-reviewer
description: Reviews code changes for quality and security
tools: Read, Grep, Glob
model: haiku
---

Review code for:
- Security vulnerabilities (OWASP top 10)
- Performance issues
- Code style consistency
```

## Skills

Project skills in `.claude/skills/`:

```
.claude/skills/
└── deploy/
    └── SKILL.md
```

See `docs/knowledge/claude-code-features.md` for skill format.

## Performance Tips

- **Parallel tool calls**: Batch independent operations
- **Explore agent**: Use for codebase search (faster, less context)
- **Background tasks**: Long builds can run in background

## Cloud Cost Optimization

After deploying consolidated services, suggest cleanup of:
- Replaced Cloud Run services
- Unused Artifact Registry images
- Deprecated build triggers

## Updating These Files

Keep context files fresh as the project evolves:

| Change Type | Update Location |
|-------------|-----------------|
| New commands, setup | `AGENTS.md` |
| New conventions, gotchas | `AGENTS.md` |
| Claude-specific patterns | `CLAUDE.md` |
| Reusable skills/agents | `.claude/` directory |
| Reference patterns | `docs/knowledge/` |
