# Claude Code Features Guide

Reference for underutilized Claude Code features that improve workflow efficiency.

## Skills

Personal AI capabilities that Claude uses autonomously based on context.

### Location
- **Personal skills**: `~/.claude/skills/` (apply to all projects)
- **Project skills**: `.claude/skills/` (project-specific)

### Creating a Skill
Create a markdown file describing when and how to use the skill:

```markdown
# Skill Name

## Description
What this skill does.

## When to Use
- Trigger condition 1
- Trigger condition 2

## Workflow
1. Step one
2. Step two

## Examples
...
```

### Recommended Personal Skills
- `migration-workflow.md` - Database migration safety
- `type-sync-check.md` - Monorepo type validation
- `cross-repo-learning.md` - Pattern capture

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
            "command": "echo 'File modified'"
          }
        ]
      }
    ]
  }
}
```

### Recommended Hooks
- **PostToolUse**: Auto-format TypeScript files after edit
- **Stop**: Remind to capture learnings
- **PreToolUse**: Block force push, hard reset

---

## Subagents

Specialized agents for specific task types.

### Built-in Types
| Type | Purpose | Tools |
|------|---------|-------|
| `Explore` | Fast codebase search | Read-only, Haiku model |
| `Plan` | Implementation planning | All tools |
| `claude-code-guide` | Claude Code documentation | Docs access |
| `general-purpose` | Complex multi-step tasks | All tools |

### When to Use Explore
- Finding files by pattern
- Understanding code structure
- "Where is X handled?" questions
- Any search needing multiple attempts

```
Use Task tool with subagent_type=Explore
```

### Benefits
- Separate context window (doesn't pollute main conversation)
- Cheaper model for simple tasks
- Parallel execution possible

---

## Permissions

Control which operations require confirmation.

### Configuration
In `~/.claude/settings.json`:

```json
{
  "permissions": {
    "ask": [
      "Edit(**/CLAUDE.md)",
      "Edit(**/migrations/**)",
      "Bash(git push*)",
      "Bash(supabase db push*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

### Recommended Rules
- **ask**: Protected files, deployment commands, database pushes
- **deny**: Force push, hard reset, destructive commands

---

## Settings Reference

Full `~/.claude/settings.json` example:

```json
{
  "alwaysThinkingEnabled": true,
  "permissions": {
    "ask": [
      "Edit(**/CLAUDE.md)",
      "Edit(**/migrations/**)",
      "Bash(supabase db reset*)",
      "Bash(supabase db push*)",
      "Bash(git push*)"
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
            "command": "echo 'Consider: patterns worth capturing as skills or knowledge docs?'"
          }
        ]
      }
    ]
  }
}
```

---

## Capturing Learnings

Turn discoveries into reusable knowledge - don't just note them, codify them.

### Where to Capture
| Pattern Type | Target Location |
|--------------|-----------------|
| Project conventions | `CLAUDE.md` (project root) |
| Technical guides | `docs/knowledge/*.md` |
| Personal preferences | `~/.claude/CLAUDE.md` |
| Reusable workflows | `~/.claude/skills/*.md` |
| Safety rules | `~/.claude/settings.json` |

### Workflow
1. **Notice**: Identify reusable pattern during work
2. **Categorize**: Project-specific vs personal vs template
3. **Offer**: Ask "Want me to add this to [target]?"
4. **Edit**: Make the actual change if confirmed

### What to Capture
- Gotchas and footguns
- Service integration patterns
- Safety rules
- Performance optimizations
- Tool/framework patterns
- Repeated workflows (-> skills)
- Manual validation steps (-> hooks)
- Dangerous commands (-> permissions)
