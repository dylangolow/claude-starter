# Claude Code Features Guide

Reference for Claude Code features that improve workflow efficiency.

## File Structure Overview

```
project/
├── AGENTS.md              # Cross-tool context (Copilot, Cursor, Codex, etc.)
├── CLAUDE.md              # Claude-specific features
└── .claude/
    ├── agents/            # Custom subagents
    │   └── code-reviewer.md
    └── skills/            # Project skills
        └── deploy/
            └── SKILL.md
```

User-level configuration:
```
~/.claude/
├── CLAUDE.md              # Personal preferences (all projects)
├── settings.json          # Permissions, hooks, thinking mode
├── agents/                # Personal subagents
└── skills/                # Personal skills
```

---

## Subagents

Specialized agents for specific task types. Run in separate context windows.

### File Format

Markdown files with YAML frontmatter in `.claude/agents/` or `~/.claude/agents/`:

```markdown
---
name: code-reviewer
description: Reviews code changes for quality, security, and style
tools: Read, Grep, Glob
model: haiku
---

You are a code reviewer. Analyze code for:

## Security
- OWASP top 10 vulnerabilities
- Input validation
- Authentication/authorization issues

## Quality
- Error handling
- Edge cases
- Performance concerns

## Style
- Consistency with codebase conventions
- Naming clarity
- Code organization

Provide specific, actionable feedback with file:line references.
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (lowercase, hyphens, max 64 chars) |
| `description` | Yes | When Claude should use this subagent |
| `tools` | No | Comma-separated list (inherits all if omitted) |
| `model` | No | `haiku`, `sonnet`, `opus`, or `inherit` |
| `skills` | No | Skills to auto-load |

### Built-in Subagent Types

| Type | Purpose | Best For |
|------|---------|----------|
| `Explore` | Fast codebase search | "Where is X?", file patterns |
| `Plan` | Implementation planning | Architecture decisions |
| `claude-code-guide` | Claude Code docs | "How do I use X feature?" |
| `general-purpose` | Complex multi-step | Research, broad tasks |

### When to Create Custom Subagents

- Repeated review/validation workflows
- Specialized domains (security audit, performance)
- Multi-step processes benefiting from focused context

---

## Skills

Capabilities Claude uses autonomously based on context. Share main conversation context.

### Directory Structure

```
.claude/skills/
└── deploy/
    ├── SKILL.md           # Required - main skill file
    ├── reference.md       # Optional - additional context
    └── scripts/           # Optional - helper scripts
        └── validate.sh
```

### File Format

SKILL.md with YAML frontmatter:

```markdown
---
name: deploy
description: Handles deployment to Cloud Run with pre/post validation
allowed-tools: Bash, Read, Grep
---

# Deploy Skill

## When to Use
- User asks to deploy a service
- After successful build completion
- When pushing changes to production

## Workflow

1. **Pre-deployment checks**
   - Verify build passes: `pnpm build`
   - Check for uncommitted changes
   - Validate environment variables

2. **Deploy**
   - Run deployment command (e.g., `pnpm deploy`, `gcloud run deploy`)
   - Monitor for errors

3. **Post-deployment**
   - Verify health endpoint
   - Check logs for errors
   - Report deployment URL

## Error Handling
- If build fails: Stop and report errors
- If deploy fails: Check logs, suggest fixes
- If health check fails: Rollback guidance
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill identifier |
| `description` | Yes | When to use this skill |
| `allowed-tools` | No | Restrict available tools |

### Subagents vs Skills

| Aspect | Subagents | Skills |
|--------|-----------|--------|
| **Context** | Separate window | Shared with main |
| **Invocation** | Explicit or auto-delegated | Autonomous by Claude |
| **Use case** | Task-specific workflows | Expertise extension |
| **File** | Single `.md` file | Directory with `SKILL.md` |

---

## Hooks

Shell commands that execute at lifecycle events.

### Available Events

| Event | Trigger | Use Case |
|-------|---------|----------|
| `PreToolUse` | Before tool execution | Block dangerous operations |
| `PostToolUse` | After tool execution | Auto-format, validate |
| `SessionStart` | Session begins | Load env, check status |
| `UserPromptSubmit` | User sends message | Inject context |
| `Stop` | Session ends | Cleanup, reminders |

### Configuration

In `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo $CLAUDE_TOOL_INPUT | grep -q 'push --force' && exit 1 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### Recommended Hooks

- **PostToolUse**: Auto-format files after edit
- **PreToolUse**: Block force push, hard reset
- **Stop**: Remind to capture learnings

---

## Permissions

Control which operations require confirmation.

### Configuration

In `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Read(**/*)",
      "Glob(**/*)",
      "Grep(**/*)"
    ],
    "ask": [
      "Edit(**/CLAUDE.md)",
      "Edit(**/migrations/**)",
      "Bash(git push*)",
      "Bash(supabase db push*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Bash(rm -rf /*)"
    ]
  }
}
```

### Permission Levels

| Level | Behavior |
|-------|----------|
| `allow` | Execute without asking |
| `ask` | Prompt for confirmation |
| `deny` | Block entirely |

### Recommended Rules

- **allow**: Read-only operations, safe searches
- **ask**: Protected files, deployment, database changes
- **deny**: Force push, hard reset, destructive commands

---

## Full Settings Example

Complete `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Read(**/*)",
      "Glob(**/*)",
      "Grep(**/*)",
      "Bash(pnpm *)",
      "Bash(npm run *)"
    ],
    "ask": [
      "Edit(**/CLAUDE.md)",
      "Edit(**/AGENTS.md)",
      "Edit(**/migrations/**)",
      "Bash(supabase db reset*)",
      "Bash(supabase db push*)",
      "Bash(git push*)",
      "Bash(gcloud * delete*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git reset --hard*)"
    ]
  },
  "hooks": {
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Consider: patterns worth capturing as skills?'"
          }
        ]
      }
    ]
  }
}
```

---

## Capturing Learnings

Turn discoveries into reusable knowledge.

### Where to Capture

| Pattern Type | Target Location |
|--------------|-----------------|
| Project setup, commands | `AGENTS.md` |
| Claude-specific patterns | `CLAUDE.md` |
| Technical guides | `docs/knowledge/*.md` |
| Personal preferences | `~/.claude/CLAUDE.md` |
| Reusable workflows | `.claude/skills/` or `~/.claude/skills/` |
| Custom reviewers | `.claude/agents/` or `~/.claude/agents/` |
| Safety rules | `~/.claude/settings.json` |

### Workflow

1. **Notice**: Identify reusable pattern during work
2. **Categorize**: Project-specific vs personal vs template
3. **Offer**: Ask "Want me to add this to [target]?"
4. **Create**: Make the actual change if confirmed

### What to Capture

- Gotchas and footguns → knowledge docs or AGENTS.md
- Safety rules → settings.json permissions
- Repeated workflows (3+ times) → skills
- Review/validation patterns → subagents
- Tool preferences → CLAUDE.md
