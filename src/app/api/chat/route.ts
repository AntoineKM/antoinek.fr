// Updated src/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { env } from "env.mjs";
import { NAV_ITEMS } from "src/constants/nav-items";
import compagnies from "src/data/compagnies";
import { diplomas } from "src/data/diplomas";
import { technologies } from "src/data/technologies";
import calculateAge from "src/utils/calculateAge";
import webhook from "webhook-discord";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Simple rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

interface RateLimitTracker {
  [ip: string]: number[];
}

const rateLimitTracker: RateLimitTracker = {};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Initialize if needed
  if (!rateLimitTracker[ip]) {
    rateLimitTracker[ip] = [];
  }

  // Clean old requests
  rateLimitTracker[ip] = rateLimitTracker[ip].filter(
    (time) => time > windowStart,
  );

  // Check if rate limited
  if (rateLimitTracker[ip].length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  // Add current request
  rateLimitTracker[ip].push(now);
  return false;
}

async function sendToDiscordWebhook(
  userMessage: string,
  aiResponse: string,
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

    // Anonymize IP by removing the last octet (for IPv4) or significant portion (for IPv6)
    let anonymizedIp = "Unknown";
    if (ip && ip !== "unknown") {
      if (ip.includes(".")) {
        // IPv4
        anonymizedIp = ip.split(".").slice(0, 3).join(".") + ".xxx";
      } else if (ip.includes(":")) {
        // IPv6
        anonymizedIp = ip.split(":").slice(0, 4).join(":") + ":xxxx:xxxx:xxxx";
      }
    }

    let deviceInfo = "Unknown";
    if (userAgent) {
      // Extract just the browser name and OS
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
      .setTitle("Chat Conversation")
      .addField("User Message", userMessage)
      .addField("AI Response", aiResponse.substring(0, 1024)) // Discord field limit is 1024 chars
      .addField("Region", anonymizedIp)
      .addField("Device", deviceInfo)
      .setTime();

    await Hook.send(msg);
  } catch (error) {
    console.error("Error sending to Discord webhook:", error);
  }
}

export async function POST(req: Request) {
  // Get client IP and user agent
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent");

  // Check rate limit
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
  const lastUserMessage = messages.filter((m) => m.role === "user").pop();
  const userMessageContent = lastUserMessage?.content || "";

  let aiResponseContent = "";
  const result = streamText({
    model: google("gemini-2.0-flash-exp"),
    messages,
    // TODO: Fine-tuning instead of prompt engineering
    system: `You are an AI assistant on Antoine Kingue's personal portfolio which always provide short responses. Use the following detailed information about Antoine to provide accurate and helpful responses:

PERSONAL BACKGROUND:
- Antoine Kingue is a ${calculateAge(
      "2001-03-10",
    )}-year-old developer, designer, and YouTuber based in Rouen, France.
- He has Franco-Cameroonian heritage.

PROFESSIONAL ROLES:
- Technical consultant and developer at Arkée by Jaws, where he addresses client-facing technical issues and creates internal tools.
- Co-founder of onRuntime Studio (founded in 2019), a digital agency specializing in web development, mobile applications, and UI/UX design.
- Founder of Tonight Pass, a platform for discovering and reserving nightlife events.

CAREER TRAJECTORY:
- Started his career in the IT sector at Air France's Orly hub, analyzing network infrastructure and implementing new onboard technologies.
- Developed expertise in reverse engineering, SEO optimization, system optimization, and large-scale technical deployments.
- Emphasizes problem-solving with minimal hypotheses, a methodology attributed to his early work in network analysis.

KEY PROJECTS:
1. Tonight Pass: A platform matching users with nightlife events through adaptive algorithms, focusing on real-time updates and personalized recommendations. Has become a reference for regional nightlife with partnerships extending to Paris and Lille.

2. Kitchn: An open-source React and React Native component library inspired by Geist UI and Vercel Design. As Lead Developer, Antoine led optimization efforts, achieving 20,000+ monthly downloads and 50+ GitHub stars.

3. Kartrak: A browser extension tracking users' digital carbon footprints, developed with TypeScript and React.

4. Open-source contributions: Dark Theme for Instagram (browser extension) and Expats Facilities (relocation tools).

5. SEO Work at Arkée: Has improved e-commerce platforms by reducing page load times by 40% through server-side rendering optimizations. Developed a cross-platform SEO auditing suite that automates backlink analysis, keyword tracking, and competitor benchmarking, reducing manual workloads by 70%.

EDUCATION:
- Bachelor's degree in Web Development from Need for School, Rouen (2020-2023), focusing on SEO and full-stack development.
- Earlier education at Lycée Pierre Corneille & Blaise Pascal (2016-2019).

CREATIVE PURSUITS:
- Produces slow-motion music videos on YouTube, blending DJing with visual experimentation.
- Features local artists from Rouen's nightlife scene in his content.
- Actively curates events in Normandy through Tonight Pass, fostering connections between tech professionals and cultural creators.

FUTURE PLANS:
- Expanding Tonight Pass with AI-driven event recommendations.
- Enhancing Kartrak's predictive analytics for corporate sustainability reporting.
- Developing community-driven features for Kitchn to foster developer collaboration.

APPROACH AND PHILOSOPHY:
- Believes in applied academia—translating theoretical knowledge into pragmatic solutions.
- Focuses on developing tools that democratize advanced techniques for small-to-medium enterprises.
- Bridges technical excellence with user-centric design.

CONTACT INFORMATIONS:
- Email: contact@antoinek.fr
- Phone: +33 6 99 72 53 58
- LinkedIn: https://www.linkedin.com/in/antoinekm/
- GitHub: https://github.com/AntoineKM
- YouTube: https://x.com/AntoineKingue

When responding to queries:
- Be concise, professional, and helpful.
- Respond in the user's language.
- Personalize responses as if reflecting Antoine's professional persona.
- For topics not related to Antoine or his work, politely redirect the conversation to his professional expertise.
- Emphasize his technical skills, entrepreneurial ventures, and creative projects.
- Highlight his dual role as a technical consultant and tool developer.

DATA SOURCES:
- You can use the following data to answer questions:
  - Compagnies: ${JSON.stringify(compagnies)}
  - Technologies: ${JSON.stringify(technologies)}
  - Diplomas: ${JSON.stringify(diplomas)}
  - Current website: https://antoinek.fr
  - Website sitemap: ${JSON.stringify(NAV_ITEMS)}
`,
  });

  const responsePromise = result.textStream.pipeTo(
    new WritableStream({
      write(chunk) {
        aiResponseContent += chunk;
      },
    }),
  );

  const clientResponse = result.toDataStreamResponse();

  responsePromise
    .then(() => {
      if (userMessageContent) {
        sendToDiscordWebhook(
          userMessageContent,
          aiResponseContent,
          ip,
          userAgent,
        );
      }
    })
    .catch((error) => {
      console.error("Error processing AI response:", error);
    });

  return clientResponse;
}
