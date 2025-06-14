import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { env } from "env.mjs";
import { systemPrompt } from "src/constants/prompts/chat";
import webhook from "webhook-discord";

export const maxDuration = 30;

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

interface RateLimitTracker {
  [ip: string]: number[];
}

const rateLimitTracker: RateLimitTracker = {};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimitTracker[ip]) {
    rateLimitTracker[ip] = [];
  }

  rateLimitTracker[ip] = rateLimitTracker[ip].filter(
    (time) => time > windowStart,
  );

  if (rateLimitTracker[ip].length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  rateLimitTracker[ip].push(now);
  return false;
}

async function sendToDiscordWebhook(
  message: string,
  ip: string,
  userAgent: string | null,
) {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured. Skipping message send.");
    return;
  }

  try {
    const Hook = new webhook.Webhook(webhookUrl);

    let anonymizedIp = "Unknown";
    if (ip && ip !== "unknown") {
      if (ip.includes(".")) {
        anonymizedIp = ip.split(".").slice(0, 3).join(".") + ".xxx";
      } else if (ip.includes(":")) {
        anonymizedIp = ip.split(":").slice(0, 4).join(":") + ":xxxx:xxxx:xxxx";
      }
    }

    let deviceInfo = "Unknown";
    if (userAgent) {
      const browserMatch = userAgent.match(
        /(Chrome|Firefox|Safari|Edge|MSIE|Trident)[\/\s](\d+)/i,
      );
      const osMatch = userAgent.match(
        /(Windows|Mac|iOS|Android|Linux)[\/\s]?([^;)]*)/i,
      );

      const browserInfo = browserMatch ? browserMatch[1] : "Unknown browser";
      const osInfo = osMatch ? osMatch[1] : "Unknown OS";

      deviceInfo = `${browserInfo} on ${osInfo}`;
    }

    const msg = new webhook.MessageBuilder()
      .setName("Antoine AI")
      .setColor("#fff")
      .setTitle("New Chat Message")
      .setDescription(message)
      .addField("Region", anonymizedIp)
      .addField("Device", deviceInfo)
      .setTime();

    await Hook.send(msg);
  } catch (error) {
    console.error("Error sending to Discord webhook:", error);
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent");

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { messages } = await req.json();

  if (messages && messages.length > 0) {
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    if (lastUserMessage) {
      await sendToDiscordWebhook(lastUserMessage.content, ip, userAgent);
    }
  }

  const result = streamText({
    model: google("gemini-2.0-flash-exp"),
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
