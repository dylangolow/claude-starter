# Supabase Edge Functions

Patterns for using Supabase Edge Functions for webhooks, notifications, and external API calls.

## When to Use Edge Functions vs pg_net

| Use Case | Approach | Why |
|----------|----------|-----|
| Webhooks, notifications | Edge Function | Better logging, error handling, testability |
| Simple internal DB calls | pg_net directly | Lower latency, no cold start |
| External APIs with auth | Edge Function | Easier secret management, retry logic |
| Complex business logic | Edge Function | TypeScript, easier to debug |

## Database Trigger → Edge Function Pattern

Instead of calling external APIs directly from PostgreSQL triggers with pg_net, route through an Edge Function for better observability.

### 1. Create the Edge Function

```typescript
// supabase/functions/notify-admin/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { PostHog } from "npm:posthog-node@4.0.1"

const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL")
const POSTHOG_API_KEY = Deno.env.get("POSTHOG_API_KEY")

const posthog = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: "https://us.i.posthog.com" })
  : null

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  record: Record<string, unknown>
}

serve(async (req) => {
  const payload: WebhookPayload = await req.json()

  // Handle based on table/type
  if (payload.table === "feedback" && payload.type === "INSERT") {
    // Send to Slack, log to PostHog, etc.
  }

  // Track in PostHog
  if (posthog) {
    posthog.capture({
      distinctId: "system",
      event: "notification_sent",
      properties: { table: payload.table, type: payload.type }
    })
    await posthog.flush()
  }

  return new Response(JSON.stringify({ success: true }))
})
```

### 2. Create Database Trigger

```sql
-- Store edge function URL in config
INSERT INTO app_config (key, value)
VALUES ('notify_admin_url', 'https://<project>.supabase.co/functions/v1/notify-admin')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Trigger function that calls edge function
CREATE OR REPLACE FUNCTION notify_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url TEXT;
BEGIN
  SELECT value INTO edge_function_url
  FROM app_config WHERE key = 'notify_admin_url';

  PERFORM net.http_post(
    url := edge_function_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', TG_TABLE_NAME,
      'record', to_jsonb(NEW)
    )
  );

  RETURN NEW;
END;
$$;

-- Attach to table
CREATE TRIGGER on_feedback_created
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_insert();
```

### 3. Set Secrets and Deploy

```bash
supabase secrets set SLACK_WEBHOOK_URL=https://hooks.slack.com/...
supabase secrets set POSTHOG_API_KEY=phc_...
supabase functions deploy notify-admin --no-verify-jwt
```

## Slack Block Kit Formatting

Use Block Kit for rich Slack messages instead of plain text with `\n`:

```typescript
const blocks = [
  {
    type: "header",
    text: { type: "plain_text", text: ":tada: New Signup", emoji: true }
  },
  {
    type: "section",
    fields: [
      { type: "mrkdwn", text: `*Email:*\n${email}` },
      { type: "mrkdwn", text: `*Time:*\n${timestamp}` }
    ]
  }
]

await fetch(SLACK_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ blocks })
})
```

## PostHog Integration

Add observability to Edge Functions:

```typescript
import { PostHog } from "npm:posthog-node@4.0.1"

const posthog = new PostHog(POSTHOG_API_KEY, {
  host: "https://us.i.posthog.com"
})

// Track events
posthog.capture({
  distinctId: userId || "system",
  event: "edge_function_called",
  properties: {
    function: "notify-admin",
    table: payload.table,
    success: true
  }
})

// Always flush before response
await posthog.flush()
```

## Deployment Commands

```bash
# List functions
supabase functions list

# Deploy single function
supabase functions deploy <name> --no-verify-jwt

# Set secrets
supabase secrets set KEY=value

# Check logs
supabase functions logs <name> --tail
```
