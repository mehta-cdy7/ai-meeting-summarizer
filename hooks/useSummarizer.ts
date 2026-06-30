import { useState, useEffect } from "react";
import { StructuredSummary } from "../types";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";

const meetingSummarySchema = z.object({
  title: z.string().optional(),
  overview: z.string().optional(),
  key_decisions: z.array(z.string()).optional(),
  action_items: z.array(
    z.object({
      assignee: z.string().optional(),
      task: z.string().optional(),
      deadline: z.string().optional(),
    })
  ).optional(),
});


interface UseSummarizerProps {
  onSummaryGenerated?: (summary: StructuredSummary, rawTranscript: string) => Promise<void> | void;
}

export function useSummarizer({ onSummaryGenerated }: UseSummarizerProps = {}) {
  const [status, setStatus] = useState<
    "idle" | "uploading" | "transcribing" | "summarizing" | "completed" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState<StructuredSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadStart = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setUploadProgress(0);
    setStatus("uploading");
  };

  const handleReset = () => {
    setStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
    setTranscript("");
    setSummary(null);
    setError(null);
  };

  // Upload Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "uploading") {
      interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStatus("transcribing");
            }, 400);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // Whisper transcription fetch
  useEffect(() => {
    if (status !== "transcribing" || !selectedFile) return;

    let active = true;

    async function transcribe() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
        if (!apiKey) {
          throw new Error("NEXT_PUBLIC_OPEN_AI_KEY environment variable is not defined");
        }

        const formData = new FormData();
        formData.append("file", selectedFile!);
        formData.append("model", "whisper-1");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.error?.message || `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        if (active) {
          setTranscript(data.text || "No transcription text returned.");
          setStatus("summarizing");
        }
      } catch (err: any) {
        if (active) {
          console.error("Whisper transcription error:", err);
          setError(err.message || "An error occurred during transcription");
          setStatus("error");
        }
      }
    }

    transcribe();

    return () => {
      active = false;
    };
  }, [status, selectedFile]);

  const { object: streamedSummary, submit, error: streamError } = useObject({
    api: "/api/summarize",
    schema: meetingSummarySchema,
    onFinish({ object, error }) {
      if (error) {
        console.error("Streaming error:", error);
        setError(error.message || "Failed to stream summary");
        setStatus("error");
      } else if (object) {
        const finalSummary = object as StructuredSummary;
        setSummary(finalSummary);
        setStatus("completed");
        if (onSummaryGenerated) {
          onSummaryGenerated(finalSummary, transcript);
        }
      }
    },
  });

  // Watch for stream errors
  useEffect(() => {
    if (streamError) {
      setError(streamError.message || "An error occurred during streaming");
      setStatus("error");
    }
  }, [streamError]);

  // Trigger Vercel AI SDK streamObject streaming
  useEffect(() => {
    if (status !== "summarizing" || !transcript) return;
    submit({ transcript });
  }, [status, transcript]);

  const summaryToDisplay = status === "summarizing" && streamedSummary ? (streamedSummary as StructuredSummary) : summary;

  return {
    status,
    uploadProgress,
    selectedFile,
    transcript,
    summary: summaryToDisplay,
    error,
    handleUploadStart,
    handleReset,
  };
}

