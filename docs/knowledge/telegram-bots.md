# Telegram Bot Development

Reference guide for building Telegram bots with Node.js/TypeScript.

## Library Choice

**Recommended: grammy** (better TypeScript support than telegraf)

```bash
pnpm add grammy
```

## Project Structure

```
apps/bot/
├── src/
│   ├── index.ts           # Bot entry point
│   ├── commands/          # Command handlers
│   │   ├── start.ts
│   │   ├── help.ts
│   │   └── index.ts
│   ├── conversations/     # Multi-step conversations
│   │   └── onboarding.ts
│   ├── middleware/        # Auth, logging, etc.
│   └── utils/
├── package.json
└── Dockerfile
```

## Basic Setup

```typescript
// apps/bot/src/index.ts
import { Bot } from "grammy"
import { startCommand } from "./commands/start"
import { helpCommand } from "./commands/help"

const bot = new Bot(process.env.BOT_TOKEN!)

// Register commands
bot.command("start", startCommand)
bot.command("help", helpCommand)

// Error handling
bot.catch((err) => {
  console.error("Bot error:", err)
})

// Start bot
if (process.env.NODE_ENV === "production") {
  // Webhook mode for production
  // See webhook setup below
} else {
  // Polling mode for development
  bot.start()
  console.log("Bot started in polling mode")
}
```

## Command Handler Pattern

```typescript
// apps/bot/src/commands/start.ts
import { Context } from "grammy"

export async function startCommand(ctx: Context) {
  await ctx.reply(
    "Welcome! I'm your assistant bot.\n\n" +
    "Use /help to see available commands."
  )
}
```

## Conversations (Multi-Step Flows)

```typescript
// apps/bot/src/conversations/onboarding.ts
import { Conversation, ConversationFlavor } from "@grammyjs/conversations"
import { Context } from "grammy"

type MyContext = Context & ConversationFlavor

export async function onboarding(
  conversation: Conversation<MyContext>,
  ctx: MyContext
) {
  await ctx.reply("What's your name?")
  const nameCtx = await conversation.wait()
  const name = nameCtx.message?.text

  await ctx.reply(`Nice to meet you, ${name}! What's your email?`)
  const emailCtx = await conversation.wait()
  const email = emailCtx.message?.text

  // Save to database via shared core package
  // await createUser({ name, email })

  await ctx.reply("You're all set!")
}
```

## Webhook Setup (Production)

```typescript
// apps/bot/src/webhook.ts
import express from "express"
import { Bot, webhookCallback } from "grammy"

const app = express()
const bot = new Bot(process.env.BOT_TOKEN!)

// Register handlers...

app.use(express.json())
app.post("/webhook", webhookCallback(bot, "express"))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`)
})
```

### Setting the Webhook

```bash
# Set webhook URL (run once after deployment)
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/webhook"}'

# Verify webhook
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

## Environment Variables

```bash
# .env
BOT_TOKEN=123456:ABC-DEF...  # From @BotFather
WEBHOOK_URL=https://your-domain.com/webhook  # Production only
```

## Deployment (Cloud Run)

```dockerfile
# apps/bot/Dockerfile
FROM node:20-slim
WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
# Deploy to Cloud Run
gcloud run deploy bot-service \
  --source=apps/bot \
  --region=us-central1 \
  --set-env-vars="BOT_TOKEN=..."
```

## Sharing Business Logic

Use `@[project]/core` for shared functionality:

```typescript
// apps/bot/src/commands/status.ts
import { getProjectStatus } from "@myproject/core"

export async function statusCommand(ctx: Context) {
  const userId = ctx.from?.id.toString()
  const status = await getProjectStatus(userId)
  await ctx.reply(`Current status: ${status}`)
}
```

## Tips

1. **Polling vs Webhook**: Use polling for local dev, webhook for production
2. **Rate limits**: Telegram has rate limits (~30 messages/second)
3. **Long-running tasks**: Respond quickly, process in background
4. **Inline keyboards**: Use for interactive buttons
5. **Session storage**: grammy supports various session backends

## Resources

- [grammy docs](https://grammy.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [@BotFather](https://t.me/botfather) - Create and manage bots
