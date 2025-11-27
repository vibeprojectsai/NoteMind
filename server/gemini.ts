import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.error("Missing API key: AI_INTEGRATIONS_GEMINI_API_KEY or GEMINI_API_KEY not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function summarizeText(content: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an expert document summarizer. Provide a clear, well-structured summary of the following text.

IMPORTANT: Do NOT use asterisks (*) or double asterisks (**) for formatting. Use plain text only. No markdown bold or italic formatting.

Guidelines:
- Start with a brief overview (1-2 sentences)
- Use numbered points (1, 2, 3...) for main ideas or key points
- Use bullet points (dashes -) as sub-points under each numbered main point
- Include important details, facts, or conclusions
- Keep the summary concise but comprehensive
- Maintain the original tone and context

IMPORTANT: Do NOT use asterisks (*) or double asterisks (**) for formatting. Use plain text only. No markdown bold or italic formatting.

Text to summarize:

${content}

Summary:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() || "Unable to generate summary.";
}
