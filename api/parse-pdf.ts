import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore
import pdf from "pdf-parse";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileData, fileName, mimeType } = req.body;

    if (!fileData || !fileName || !mimeType) {
      return res.status(400).json({ error: 'File data, name, and type are required' });
    }

    if (mimeType !== "application/pdf") {
      return res.status(400).json({ error: 'Only PDF files are supported for parsing' });
    }

    const base64Data = fileData.replace(/^data:application\/pdf;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Use pdf-parse correctly as a function
    const data = await pdf(buffer);
    const text = data.text.trim();

    if (!text) {
      return res.status(400).json({ error: 'Could not extract text from PDF. The file might be empty or image-based.' });
    }

    res.json({ content: text });
  } catch (error) {
    console.error("PDF parsing error:", error);
    res.status(500).json({ error: 'Failed to parse PDF file. Please try again.' });
  }
}
