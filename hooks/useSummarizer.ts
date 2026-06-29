import { useState, useEffect } from "react";
import { StructuredSummary } from "../types";

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

  // GPT-4o-mini summarizer fetch
  useEffect(() => {
    if (status !== "summarizing" || !transcript) return;

    let active = true;

    async function summarize() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
        if (!apiKey) {
          throw new Error("NEXT_PUBLIC_OPEN_AI_KEY environment variable is not defined");
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional AI meeting assistant. Generate a high-quality meeting summary with a title and the following sections:\n- Title\n- Overview\n- Key Decisions\n- Action Items\nBe concise, specific, and clear. You must output a JSON object adhering exactly to the provided schema.",
              },
              {
                role: "user",
                content: transcript,
              },
            ],
            temperature: 0.5,
            max_tokens: 1500,
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "meeting_summary",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "A short, descriptive title for the meeting (3-5 words).",
                    },
                    overview: {
                      type: "string",
                      description: "A 2-3 sentence high-level summary of the meeting.",
                    },
                    key_decisions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "A list of the major decisions approved or agreed upon.",
                    },
                    action_items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          assignee: {
                            type: "string",
                            description: "The name of the person assigned, or 'Unassigned'",
                          },
                          task: {
                            type: "string",
                          },
                          deadline: {
                            type: "string",
                            description: "The due date, or 'TBD' if not mentioned",
                          },
                        },
                        required: ["assignee", "task", "deadline"],
                        additionalProperties: false,
                      },
                      description: "A list of actionable tasks.",
                    },
                  },
                  required: ["title", "overview", "key_decisions", "action_items"],
                  additionalProperties: false,
                },
              },
            },
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.error?.message || `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        if (active) {
          const content = data.choices[0]?.message?.content;
          if (content) {
            try {
              const parsed: StructuredSummary = JSON.parse(content);
              setSummary(parsed);

              // Trigger save callback if defined
              if (onSummaryGenerated) {
                await onSummaryGenerated(parsed, transcript);
              }
            } catch (jsonErr) {
              console.error("Failed to parse JSON schema response:", jsonErr);
              throw new Error("Failed to parse the structured summary response from the server");
            }
          } else {
            throw new Error("No summary generated.");
          }
          setStatus("completed");
        }
      } catch (err: any) {
        if (active) {
          console.error("GPT-4o-mini summarization error:", err);
          setError(err.message || "An error occurred during summarization");
          setStatus("error");
        }
      }
    }

    summarize();

    return () => {
      active = false;
    };
  }, [status, transcript]);

  return {
    status,
    uploadProgress,
    selectedFile,
    transcript,
    summary,
    error,
    handleUploadStart,
    handleReset,
  };
}
