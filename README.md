# Claude Starter Template

A project template for working effectively with Claude Code.

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
├── CLAUDE.md              # Project context for Claude (customize this)
├── CLAUDE_INIT.md         # Bootstrap guide for /init command
├── docs/
│   ├── HOW_TO_USE_CLAUDE.md   # Usage guide and best practices
│   ├── plans/
│   │   ├── ROADMAP.md         # What to build (priority queue)
│   │   └── IMPLEMENTATION.md  # How to build it (technical guide)
│   ├── specs/                 # Feature specifications (add your own)
│   └── knowledge/             # Reference patterns
│       ├── telegram-bots.md   # Telegram bot development guide
│       └── monorepo-setup.md  # pnpm workspaces setup guide
└── .gitignore
```

## After /init

The `/init` command will help you:
1. Set your project name and description
2. Choose architecture (monorepo vs standalone)
3. Select your tech stack
4. Generate customized project files

## Key Concepts

- **CLAUDE.md**: Your project's "brain dump" - structure, commands, patterns
- **ROADMAP.md**: Strategic planning - what to build, in priority order
- **IMPLEMENTATION.md**: Tactical execution - how to build it, with checkboxes
- **docs/specs/**: Feature specifications with requirements and deliverables
- **context/**: Ephemeral files (gitignored) - meeting notes, research, temp checklists

## Documentation

See `docs/HOW_TO_USE_CLAUDE.md` for detailed usage patterns and tips.
