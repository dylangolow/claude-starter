# Claude Starter Template

A project template for working effectively with AI coding agents.

## Quick Start

### Option 1: GitHub Template
1. Click "Use this template" on GitHub
2. Clone your new repo
3. Run `claude` and type `/init`

### Option 2: Clone
```bash
git clone https://github.com/yourusername/claude-starter my-project
cd my-project
rm -rf .git && git init
claude
# Type: /init
```

### Option 3: Manual Setup
Copy the files you need into your existing project.

## What's Included

```
claude-starter/
├── AGENTS.md              # Cross-tool context (Copilot, Cursor, Codex, Jules)
├── CLAUDE.md              # Claude-specific features and config
├── CLAUDE_INIT.md         # Bootstrap guide for /init command
├── .claude/
│   ├── agents/            # Custom subagents (YAML frontmatter + prompt)
│   │   └── code-reviewer.md
│   └── skills/            # Project skills (SKILL.md + supporting files)
│       └── commit/
├── docs/
│   ├── HOW_TO_USE_CLAUDE.md   # Usage guide and best practices
│   ├── plans/
│   │   ├── ROADMAP.md         # What to build (priority queue)
│   │   └── IMPLEMENTATION.md  # How to build it (technical guide)
│   ├── specs/                 # Feature specifications (add your own)
│   └── knowledge/             # Reference patterns
│       ├── claude-code-features.md  # Skills, hooks, subagents, permissions
│       ├── telegram-bots.md         # Telegram bot development
│       ├── monorepo-setup.md        # pnpm workspaces setup
│       └── supabase-edge-functions.md
├── context/               # Ephemeral files (gitignored)
└── .gitignore
```

## Dual-File Approach

| File | Purpose | Works With |
|------|---------|------------|
| `AGENTS.md` | Project setup, structure, commands | Any AI tool |
| `CLAUDE.md` | Safety rules, workflow, Claude features | Claude Code |

This separation means:
- Your project works with Copilot, Cursor, Codex, and other AI tools
- Claude Code gets its advanced features (skills, hooks, subagents)
- No vendor lock-in on basic project context

## After /init

The `/init` command will help you:
1. Set your project name and description
2. Choose architecture (monorepo vs standalone)
3. Select your tech stack
4. Generate customized `AGENTS.md` and `CLAUDE.md`
5. Set up `.claude/` directory for agents and skills

## Key Concepts

| Concept | Description |
|---------|-------------|
| **AGENTS.md** | Cross-tool project context - setup, structure, code style |
| **CLAUDE.md** | Claude-specific - safety, workflow, tool preferences |
| **Subagents** | Specialized agents in `.claude/agents/` (separate context) |
| **Skills** | Autonomous capabilities in `.claude/skills/` (shared context) |
| **ROADMAP.md** | Strategic planning - what to build, prioritized |
| **IMPLEMENTATION.md** | Tactical execution - how to build it |
| **context/** | Ephemeral files (gitignored) - notes, research |

## YAML Frontmatter

Subagents and skills use YAML frontmatter - metadata at the top of markdown files:

```markdown
---
name: my-agent
description: When to use this agent
tools: Read, Grep, Glob
model: haiku
---

The actual prompt/instructions go here...
```

The `---` markers separate configuration from content.

## Documentation

- `docs/HOW_TO_USE_CLAUDE.md` - Detailed usage patterns
- `docs/knowledge/claude-code-features.md` - Skills, hooks, subagents setup