import { perplexity } from "@ai-sdk/perplexity";
import { generateObject } from "ai";
import { companyAnalysisPrompt } from "src/constants/prompts/company";
import { z } from "zod";

const CompanyAnalysisSchema = z.object({
  name: z.string().describe("The company name"),
  industry: z
    .string()
    .describe("The industry or sector the company operates in"),
  description: z
    .string()
    .describe("A brief description of what the company does"),
  values: z.array(z.string()).describe("Key company values or culture points"),
  recentNews: z.string().describe("Any recent notable news or developments"),
  size: z
    .string()
    .describe("Company size (startup, small, medium, large, enterprise)"),
  locations: z
    .array(z.string())
    .describe("Main office locations or countries of operation"),
});

export async function POST(req: Request) {
  try {
    const { companyName, language } = await req.json();

    if (!companyName) {
      return Response.json(
        { error: "Company name is required" },
        { status: 400 },
      );
    }

    const systemPrompt = `${companyAnalysisPrompt}

Respond in ${language}.`;

    const userPrompt = `Analyze the company "${companyName}" and provide detailed information about its industry, description, values, recent news, size, and main locations.`;

    const result = await generateObject({
      model: perplexity("sonar-pro"),
      system: systemPrompt,
      prompt: userPrompt,
      schema: CompanyAnalysisSchema,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Error analyzing company:", error);
    return Response.json(
      { error: "Failed to analyze company" },
      { status: 500 },
    );
  }
}
