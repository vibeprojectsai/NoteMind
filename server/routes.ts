import type { Express } from "express";
import { createServer, type Server } from "http";
import { summarizeText } from "./gemini";
import { z } from "zod";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const summarizeSchema = z.object({
  content: z.string().min(1, "Content is required").max(100000, "Content too large"),
});

const uploadSchema = z.object({
  fileData: z.string().min(1, "File data is required"),
  fileName: z.string().min(1, "File name is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/summarize", async (req, res) => {
    try {
      const result = summarizeSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: result.error.errors[0]?.message || "Invalid request"
        });
      }

      const { content } = result.data;
      const summary = await summarizeText(content);

      res.json({ summary });
    } catch (error) {
      console.error("Summarization error:", error);
      res.status(500).json({
        error: "Failed to generate summary. Please try again."
      });
    }
  });

  app.post("/api/parse-pdf", async (req, res) => {
    try {
      const result = uploadSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: result.error.errors[0]?.message || "Invalid request"
        });
      }

      const { fileData, mimeType } = result.data;

      if (mimeType !== "application/pdf") {
        return res.status(400).json({
          error: "Only PDF files are supported for parsing"
        });
      }

      const base64Data = fileData.replace(/^data:application\/pdf;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const uint8Array = new Uint8Array(buffer);

      // Load PDF document using pdfjs-dist
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useSystemFonts: true,
      });

      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;

      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      const text = fullText.trim();

      if (!text) {
        return res.status(400).json({
          error: "Could not extract text from PDF. The file might be empty or image-based."
        });
      }

      res.json({ content: text });
    } catch (error) {
      console.error("PDF parsing error:", error);
      res.status(500).json({
        error: "Failed to parse PDF file. Please try again."
      });
    }
  });

  return httpServer;
}
