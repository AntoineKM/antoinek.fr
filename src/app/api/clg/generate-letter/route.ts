import { generateObject } from "ai";
import { z } from "zod";
import { coverLetterPrompt } from "src/constants/prompts/cover-letter";
import { openai } from "@ai-sdk/openai";

const CoverLetterSchema = z.object({
  content: z.string().describe("The raw cover letter content"),
  formatted: z.string().describe("HTML formatted version of the cover letter"),
  keyPoints: z.array(z.string()).describe("Key points highlighted in the letter"),
});

export async function POST(req: Request) {
  try {
    const { companyData, language } = await req.json();

    if (!companyData) {
      return Response.json({ error: "Company data is required" }, { status: 400 });
    }

    const systemPrompt = `${coverLetterPrompt}

Respond in ${language}.`;

    const userPrompt = `Create a professional cover letter for a position at ${companyData.name}.

Company Analysis:
${JSON.stringify(companyData, null, 2)}

Instructions:
- Use the 5W2H method naturally integrated throughout the letter
- Adapt the tone and content to match the company's culture and industry
- Highlight the most relevant experiences and achievements for this specific company
- Show genuine interest and knowledge about the company
- Provide both raw content and HTML formatted version
- Include key points that were emphasized in the letter`;

    const result = await generateObject({
      model: openai("o4-mini"),
      system: systemPrompt,
      prompt: userPrompt,
      schema: CoverLetterSchema,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return Response.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}