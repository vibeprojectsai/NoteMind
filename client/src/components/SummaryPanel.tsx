import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface SummaryPanelProps {
  summary: string;
  isLoading: boolean;
  onSummarize: () => void;
  canSummarize: boolean;
}

export function SummaryPanel({ summary, isLoading, onSummarize, canSummarize }: SummaryPanelProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The summary has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Summary</h2>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              data-testid="button-copy-summary"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
          <Button
            onClick={onSummarize}
            disabled={!canSummarize || isLoading}
            data-testid="button-summarize"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <ScrollArea className="h-[500px] rounded-md border bg-background p-4">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Generating summary...</p>
                <p className="text-sm">This may take a few moments</p>
              </div>
            </div>
          ) : summary ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-white dark:bg-zinc-900">
                {summary}
              </pre>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="h-8 w-8" />
              <p className="text-sm">Upload a file and click Summarize to generate an AI summary</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
