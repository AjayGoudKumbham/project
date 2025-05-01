
import { useCallback, useState } from "react";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// @ts-ignore - pdf-parse doesn't have TypeScript definitions
import pdfParse from "pdf-parse";
import * as pdfjsLib from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumeUploaderProps {
  onResumeProcessed: (resumeText: string, fileName: string) => void;
}

const ResumeUploader = ({ onResumeProcessed }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOC, DOCX, or TXT file");
      return;
    }
    
    setFile(file);
  };

  const removeFile = useCallback(() => {
    setFile(null);
  }, []);

  const processFile = useCallback(async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      let resumeText = "";
      
      // Process PDF files using PDF.js
      if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;
          const numPages = pdfDoc.numPages;
          const textContents = [];

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items
              .filter((item): item is TextItem => 'str' in item && typeof item.str === 'string')
              .map(item => item.str.trim())
              .filter(Boolean)
              .join(' ');
            
            if (pageText) {
              textContents.push(pageText);
            }
          }

          resumeText = textContents.join('\n\n');

          if (!resumeText || resumeText.trim().length < 50) {
            throw new Error("Could not extract sufficient text from the PDF");
          }
        } catch (error) {
          console.error("PDF processing error:", error);
          toast.error("Unable to process PDF. Please ensure the file is not corrupted or password-protected.");
          setIsProcessing(false);
          return;
        }
      } 
      // Process text files
      else if (file.type === "text/plain") {
        resumeText = await file.text();
      } 
      // For Word docs, provide a message that we'll use text extraction
      else {
        // In a real app, you'd use a backend service for DOCX parsing
        // For now, we'll extract what content we can
        const reader = new FileReader();
        resumeText = await new Promise((resolve) => {
          reader.onload = (e) => {
            // Basic text extraction 
            const result = e.target?.result;
            let extractedText = "";
            
            if (typeof result === 'string') {
              extractedText = result;
            } else if (result instanceof ArrayBuffer) {
              // Try to extract readable text from Word doc binary
              const uint8Array = new Uint8Array(result);
              const textChunks = [];
              
              // Extract ASCII text where possible
              for (let i = 0; i < uint8Array.length; i++) {
                if (uint8Array[i] >= 32 && uint8Array[i] <= 126) {
                  textChunks.push(String.fromCharCode(uint8Array[i]));
                }
              }
              
              extractedText = textChunks.join('').replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
            }
            
            // Add note for Word docs
            if (file.type.includes("word")) {
              extractedText += "\n\nNote: For Word documents, full formatting may not be preserved. For best results, please upload a PDF file.";
            }
            
            resolve(extractedText);
          };
          reader.readAsArrayBuffer(file);
        });
      }
      
      // Basic sanity check
      if (!resumeText || resumeText.trim().length < 20) {
        toast.error("Could not extract meaningful text from the file. Please try a different file.");
        setIsProcessing(false);
        return;
      }
      
      // Clean up the text - remove excessive whitespace, strange characters, etc.
      resumeText = resumeText
        .replace(/\s+/g, ' ')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .trim();
      
      onResumeProcessed(resumeText, file.name);
      toast.success("Resume processed successfully!");
    } catch (error) {
      console.error("Error processing resume:", error);
      toast.error("Error processing resume. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, onResumeProcessed]);

  return (
    <div className="space-y-4">
      <div
        className={`resume-upload-area p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed
          ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && document.getElementById("resume-upload")?.click()}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
        />
        
        {!file ? (
          <>
            <UploadCloud className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium">Upload your resume</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Drag and drop your resume file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, DOC, DOCX, TXT (PDF recommended)
            </p>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between bg-secondary p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {file && (
        <Button 
          className="w-full" 
          disabled={isProcessing}
          onClick={processFile}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Process Resume'
          )}
        </Button>
      )}
    </div>
  );
};

export default ResumeUploader;
