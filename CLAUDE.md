# Claude Code Context

> Claude-specific features and configuration. See `AGENTS.md` for cross-tool project context (setup, structure, safety rules).

## Quick Reference

| File              | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `AGENTS.md`       | Project setup, structure, safety rules (any AI tool) |
| `CLAUDE.md`       | Claude-specific features (this file)                 |
| `CODEX.md`        | Codex-specific workflow                              |
| `.claude/agents/` | Custom subagents                                     |
| `.claude/skills/` | Project-specific skills                              |

## Protected Files

Do not modify without explicit confirmation:

- `docs/plans/ROADMAP.md` - Priority queue
- `docs/plans/IMPLEMENTATION.md` - Technical build guide
- `docs/specs/*.md` - Feature specifications

## Context Files

- **`context/`**: Ephemeral files (transcripts, notes, research)
- **NEVER committed** - gitignored
- For permanent checklists, add to `docs/specs/*.md`

## Tool Preferences

- Prefer CLI commands over MCP tools (more reliable auth handling)
- Use project's package manager based on lockfile
- Edge Functions over database triggers for external calls

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
├── commit/
│   └── SKILL.md
├── firebase-preview-automation/
│   └── SKILL.md
└── security-hardening/
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

| Change Type                       | Update Location      |
| --------------------------------- | -------------------- |
| New commands, setup, safety rules | `AGENTS.md`          |
| New conventions, gotchas          | `AGENTS.md`          |
| Claude-specific patterns          | `CLAUDE.md`          |
| Codex-specific workflow           | `CODEX.md`           |
| Reusable skills/agents            | `.claude/` directory |
| Reference patterns                | `docs/knowledge/`    |

## Current Notes

- [Add project-specific notes here as you discover them]
