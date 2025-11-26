import { SummaryPanel } from "../SummaryPanel";
import { Toaster } from "@/components/ui/toaster";

export default function SummaryPanelExample() {
  const sampleSummary = `## Summary

This document provides an overview of machine learning, a branch of AI that enables systems to learn from data.

### Key Points:

- **Three main types**: supervised learning (labeled data), unsupervised learning (pattern discovery), and reinforcement learning (environment interaction)

- **Common applications**: image recognition, NLP, recommendation systems, and autonomous vehicles

- **Growing field**: Machine learning continues to expand across industries with new applications emerging regularly.

The document serves as a foundational introduction to understanding ML concepts and their real-world applications.`;

  return (
    <div className="h-[600px]">
      <SummaryPanel
        summary={sampleSummary}
        isLoading={false}
        onSummarize={() => console.log("Summarize clicked")}
        canSummarize={true}
      />
      <Toaster />
    </div>
  );
}
