import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function summarizeText(content: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `You are an expert document summarizer. Provide a clear, well-structured summary of the following text.

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (content.length > 100000) {
      return res.status(400).json({ error: 'Content too large' });
    }

    const summary = await summarizeText(content);
    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: 'Failed to generate summary. Please try again.' });
  }
}
