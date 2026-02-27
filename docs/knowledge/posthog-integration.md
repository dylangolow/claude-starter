# PostHog Integration

Patterns for adding PostHog analytics to a project.

## Setup

### Install

```bash
# Client (browser)
pnpm add posthog-js

# Server (Node.js / Edge)
pnpm add posthog-node
```

### Environment Variables

```bash
# Client-visible (Next.js uses NEXT_PUBLIC_, Vite uses VITE_)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Server-only (for posthog-node)
POSTHOG_API_KEY=phc_...
```

### Client Initialization

```typescript
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function initAnalytics() {
  if (!KEY) return;
  posthog.init(KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,   // Manual control recommended
    capture_pageleave: true,
    autocapture: false,        // Explicit events only
  });
}
```

Initialize once in the app root (e.g., layout component or main.tsx).

### Server Initialization

```typescript
import { PostHog } from "posthog-node";

let ph: PostHog | null = null;

function getPostHog(): PostHog | null {
  const key = process.env.POSTHOG_API_KEY;
  if (!key) return null;
  if (ph) return ph;
  ph = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  });
  return ph;
}
```

Use a singleton — don't create a new instance per request.

## Event Naming

Use lowercase with underscores. Prefix with domain:

```
{domain}_{action}_{detail}
```

| Domain | Examples |
|--------|---------|
| `creator_` | `creator_login_submit`, `creator_dashboard_viewed` |
| `viewer_` | `viewer_page_viewed`, `viewer_unlock_failed` |
| `billing_` | `billing_checkout_opened`, `billing_webhook_processed` |
| `api_` | `api_error`, `api_rate_limited` |

### Documenting Events

Keep an event reference in `docs/analytics/events.md`:

```markdown
## creator_login_submit
- **When**: User submits login form
- **Properties**: `{ method: "magic_link" | "password" }`
- **Added**: Phase 1
```

## Logger Pattern

Wrap PostHog in a logger that adds module context automatically:

```typescript
export function createLogger(module: string) {
  return {
    track(event: string, properties?: Record<string, unknown>) {
      posthog.capture(event, { ...properties, module });
    },
    error(message: string, error?: Error, meta?: Record<string, unknown>) {
      console.error(`[${module}]`, message, error);
      posthog.capture("error", {
        module,
        message: message.slice(0, 300),
        stack: error?.stack?.slice(0, 1200),
        ...meta,
      });
    },
  };
}
```

Usage:
```typescript
const log = createLogger("api/countdowns");
log.track("countdown_created", { slug, template });
```

## Global Error Handlers

Register once on initialization to catch unhandled errors:

```typescript
export function registerGlobalErrorHandlers() {
  window.addEventListener("error", (e) => {
    posthog.capture("browser_exception", {
      message: String(e.error || e.message).slice(0, 300),
      source: "window.error",
    });
  });
  window.addEventListener("unhandledrejection", (e) => {
    posthog.capture("unhandled_rejection", {
      message: String(e.reason).slice(0, 300),
      source: "window.unhandledrejection",
    });
  });
}
```

## Server-Side Tracking

For API routes, pass a `distinctId` and flush:

```typescript
const client = getPostHog();
if (client) {
  client.capture({
    distinctId: userId || "anon",
    event: "countdown_created",
    properties: { slug },
  });
  await client.flush();  // Ensure delivery before response ends
}
```

### Distinct ID Strategy

| Context | Distinct ID |
|---------|-------------|
| Authenticated user | Supabase user ID |
| Anonymous viewer | `"viewer:<slug>"` or `"anon"` |
| System events | `"system"` |

## Graceful Degradation

Always guard against missing API keys — PostHog should never break the app:

```typescript
export function track(event: string, props?: Record<string, unknown>) {
  if (!KEY) return;  // No-op if not configured
  posthog.capture(event, props);
}
```

## MCP Server

For AI-assisted analytics queries, configure a PostHog MCP server in `.claude.json`:

```json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-posthog"],
      "env": {
        "POSTHOG_API_KEY": "...",
        "POSTHOG_PROJECT_ID": "..."
      }
    }
  }
}
```
