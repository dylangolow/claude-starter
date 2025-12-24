# Monorepo Setup with pnpm Workspaces

Reference guide for setting up a TypeScript monorepo.

## Structure

```
project/
├── apps/                    # Deployable applications
│   ├── web/                # Frontend (React, Vue, etc.)
│   ├── api/                # Backend API
│   └── bot/                # Telegram bot, CLI, etc.
├── packages/               # Shared libraries
│   └── core/              # Shared types, utils, business logic
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # Workspace configuration
└── tsconfig.json          # Base TypeScript config
```

## Initial Setup

### 1. Create pnpm-workspace.yaml

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2. Root package.json

```json
{
  "name": "my-project",
  "private": true,
  "scripts": {
    "dev": "pnpm -r dev",
    "dev:all": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### 3. Base tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true
  }
}
```

## Setting Up packages/core

### packages/core/package.json

```json
{
  "name": "@myproject/core",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### packages/core/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### packages/core/src/index.ts

```typescript
// Re-export everything
export * from "./types"
export * from "./utils"
```

### packages/core/src/types.ts

```typescript
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
```

## Setting Up an App (e.g., apps/api)

### apps/api/package.json

```json
{
  "name": "@myproject/api",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@myproject/core": "workspace:*",
    "express": "^4.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### apps/api/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../../packages/core" }
  ]
}
```

### Using Shared Code

```typescript
// apps/api/src/index.ts
import { User, ApiResponse } from "@myproject/core"

// Types are available
const user: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  created_at: new Date().toISOString()
}
```

## Build Order

Build packages before apps (dependencies first):

```json
{
  "scripts": {
    "build": "pnpm --filter @myproject/core build && pnpm --filter './apps/*' build",
    "build:all": "pnpm -r build"
  }
}
```

Or use `--filter` with dependencies:

```bash
# Build core and everything that depends on it
pnpm --filter @myproject/core... build
```

## Adding Dependencies

```bash
# Add to specific package
pnpm add lodash --filter @myproject/core

# Add dev dependency to root
pnpm add -D typescript -w

# Add workspace dependency
pnpm add @myproject/core --filter @myproject/api --workspace
```

## Common Issues

### TypeScript Can't Find Package

Ensure `references` in tsconfig.json point to dependencies:

```json
{
  "references": [
    { "path": "../../packages/core" }
  ]
}
```

### Changes Not Reflected

Build the core package first:

```bash
pnpm --filter @myproject/core build
```

Or use watch mode during development:

```bash
pnpm --filter @myproject/core dev
```

### Module Resolution

Use `"moduleResolution": "bundler"` in tsconfig for modern ESM support.

## Tips

1. **Keep core small**: Only shared types and utilities
2. **Build order matters**: Core must build before apps
3. **Use workspace protocol**: `"@myproject/core": "workspace:*"`
4. **Watch mode**: Run `pnpm dev:all` for parallel watch
5. **Type checking**: Run `pnpm typecheck` before commits

## Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
