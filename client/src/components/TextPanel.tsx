import { FileText, X } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TextPanelProps {
  title: string;
  content: string;
  fileName?: string;
  onClear?: () => void;
}

export function TextPanel({ title, content, fileName, onClear }: TextPanelProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{title}</h2>
          {fileName && (
            <span className="text-sm text-muted-foreground">({fileName})</span>
          )}
        </div>
        {onClear && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClear}
            data-testid="button-clear-file"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <ScrollArea className="h-[500px] rounded-md border bg-background p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {content || "No content to display"}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
