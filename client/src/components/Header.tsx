import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onExportPdf: () => void;
  isExporting: boolean;
  canExport: boolean;
}

export function Header({ onExportPdf, isExporting, canExport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">AI Notes Summarizer</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onExportPdf}
            disabled={!canExport || isExporting}
            variant="secondary"
            data-testid="button-export-pdf"
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
