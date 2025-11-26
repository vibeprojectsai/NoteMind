import { TextPanel } from "../TextPanel";

export default function TextPanelExample() {
  const sampleContent = `# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.

## Key Concepts

1. **Supervised Learning**: The algorithm learns from labeled training data.
2. **Unsupervised Learning**: The algorithm finds hidden patterns in unlabeled data.
3. **Reinforcement Learning**: The algorithm learns by interacting with an environment.

## Applications

- Image recognition
- Natural language processing
- Recommendation systems
- Autonomous vehicles

Machine learning continues to evolve and find new applications across various industries.`;

  return (
    <div className="h-[600px]">
      <TextPanel
        title="Original Text"
        content={sampleContent}
        fileName="machine-learning-intro.md"
        onClear={() => console.log("Clear clicked")}
      />
    </div>
  );
}
