import React from "react";
import AudioUpload from "./AudioUpload";

interface NewSummaryViewProps {
  status: "idle" | "uploading" | "transcribing" | "summarizing" | "completed" | "error";
  uploadProgress: number;
  error: string | null;
  onUploadStart: (file: File) => void;
  onReset: () => void;
}

export default function NewSummaryView({
  status,
  uploadProgress,
  error,
  onUploadStart,
  onReset,
}: NewSummaryViewProps) {
  return (
    <div className="w-full max-w-3xl text-center space-y-12 my-auto animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Instantly turn meetings into{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 animate-glow">
            actionable insights
          </span>
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
          Upload your audio recordings. Our AI will automatically transcribe and summarize your key decisions, action items, and timelines.
        </p>
      </div>

      {/* Upload Component Zone */}
      <AudioUpload
        status={status}
        uploadProgress={uploadProgress}
        onUploadStart={onUploadStart}
        errorMessage={error}
        onReset={onReset}
      />

      {/* Instructions / Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto pt-6 text-zinc-500 text-xs">
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.02] bg-white/[0.01]">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center font-bold font-mono">1</div>
          <p className="font-semibold text-zinc-400">Upload Meeting Audio</p>
          <p className="text-zinc-500 text-center">Supports MP3, WAV, M4A up to 100MB.</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.02] bg-white/[0.01]">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center font-bold font-mono">2</div>
          <p className="font-semibold text-zinc-400">Automated Transcription</p>
          <p className="text-zinc-500 text-center">Whisper models convert speech to text fast.</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.02] bg-white/[0.01]">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center font-bold font-mono">3</div>
          <p className="font-semibold text-zinc-400">AI Summarization</p>
          <p className="text-zinc-500 text-center">Get key decisions, action items and summary.</p>
        </div>
      </div>
    </div>
  );
}
