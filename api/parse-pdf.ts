import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // Dynamically import pdf-parse to handle potential import errors
    let pdf;
    try {
      // @ts-ignore
      pdf = (await import("pdf-parse")).default;
    } catch (importError) {
      console.error("Failed to import pdf-parse:", importError);
      return res.status(500).json({
        error: 'PDF parsing library not available in serverless environment',
        details: 'Please contact support'
      });
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to parse PDF file. Please try again.',
      details: errorMessage
    });
  }
}
