import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, FileCode, File, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB limit for Vercel serverless functions

interface FileUploadZoneProps {
  onFileUpload: (file: File, content: string) => void;
  isLoading: boolean;
}

export function FileUploadZone({ onFileUpload, isLoading }: FileUploadZoneProps) {
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      if (file.type === "application/pdf") {
        setIsParsing(true);
        try {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Data = reader.result as string;
            try {
              const response = await fetch("/api/parse-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fileData: base64Data,
                  fileName: file.name,
                  mimeType: file.type,
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to parse PDF");
              }

              const data = await response.json();
              onFileUpload(file, data.content);
            } catch (error) {
              console.error("PDF parsing error:", error);
              toast({
                title: "PDF parsing failed",
                description: error instanceof Error ? error.message : "Failed to parse PDF file",
                variant: "destructive",
              });
            } finally {
              setIsParsing(false);
            }
          };
          reader.readAsDataURL(file);
        } catch (error) {
          setIsParsing(false);
          console.error("File read error:", error);
          toast({
            title: "File read error",
            description: "Could not read the file. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          onFileUpload(file, content);
        };
        reader.readAsText(file);
      }
    },
    [onFileUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isLoading || isParsing,
  });

  const showLoading = isLoading || isParsing;

  return (
    <Card
      {...getRootProps()}
      className={`
        mx-auto max-w-2xl cursor-pointer border-2 border-dashed p-12 text-center
        transition-colors duration-200
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"}
        ${showLoading ? "pointer-events-none opacity-50" : ""}
      `}
      data-testid="dropzone-file-upload"
    >
      <input {...getInputProps()} data-testid="input-file" />

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {showLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-primary" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {isParsing ? "Parsing PDF..." : isDragActive ? "Drop your file here" : "Upload a document"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isParsing ? "Extracting text from your document" : "Drag and drop your file here, or click to browse"}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-3 w-3" />
            .txt
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <FileCode className="h-3 w-3" />
            .md
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <File className="h-3 w-3" />
            .pdf
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          Maximum file size: 10MB
        </p>
      </div>
    </Card>
  );
}
