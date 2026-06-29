"use client";

import React, { useState, useRef } from "react";
import { Upload, FileAudio, CheckCircle2, AlertCircle, X, Sparkles, AudioLines } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { cn, formatBytes } from "../lib/utils";

interface AudioUploadProps {
  onUploadStart: (file: File) => void;
  status: "idle" | "uploading" | "transcribing" | "summarizing" | "completed" | "error";
  uploadProgress: number;
  errorMessage?: string | null;
  onReset?: () => void;
}

export default function AudioUpload({
  onUploadStart,
  status,
  uploadProgress,
  errorMessage,
  onReset,
}: AudioUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);

    // Check if it is an audio file
    const isAudio = file.type.startsWith("audio/") ||
      /\.(mp3|wav|m4a|webm|ogg|aac|flac)$/i.test(file.name);

    if (!isAudio) {
      setError("Please drop a valid audio file (MP3, WAV, M4A, WEBM, etc.)");
      return;
    }

    // Limit size to 100MB for simulation purposes
    if (file.size > 100 * 1024 * 1024) {
      setError("File is too large. Maximum size is 100MB.");
      return;
    }

    setSelectedFile({ name: file.name, size: file.size });
    onUploadStart(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card
        className={cn(
          "transition-all duration-500 ease-out border-dashed border-2",
          isDragActive
            ? "border-violet-500 bg-violet-500/5 shadow-[0_0_30px_rgba(139,92,246,0.2)] scale-[1.01]"
            : "border-white/10 bg-white/[0.02] hover:border-white/20",
          status !== "idle" && "border-solid border-white/5 bg-white/[0.01]"
        )}
      >
        <CardContent className="p-4 sm:p-8">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={status !== "idle"}
          />

          {status === "idle" ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className="flex flex-col items-center justify-center py-12 px-4 cursor-pointer text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all duration-300">
                <Upload className="w-8 h-8 text-zinc-400 group-hover:text-violet-400 transition-colors" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                Drag & drop your audio file here
              </h3>
              <p className="text-sm text-zinc-400 mb-6 max-w-sm">
                Support for MP3, WAV, M4A, or WEBM up to 100MB
              </p>

              <button
                type="button"
                className="px-6 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
              >
                Browse Files
              </button>

              {error && (
                <div className="mt-6 flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Transcription Failed
              </h3>
              <p className="text-sm text-zinc-400 mb-6 max-w-sm">
                {errorMessage || "An unexpected error occurred while transcribing your audio."}
              </p>
              <button
                type="button"
                onClick={resetUpload}
                className="px-6 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
              >
                Try Again
              </button>
            </div>
          ) : (
            // Processing & Loading State UI
            <div className="py-6 px-2">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-violet-500/15 rounded-xl border border-violet-500/20">
                  <FileAudio className="w-8 h-8 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-white truncate">
                    {selectedFile?.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    {selectedFile && formatBytes(selectedFile.size)}
                  </p>
                </div>
                {status === "uploading" && (
                  <button
                    onClick={resetUpload}
                    className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Steps Progress Visualizer */}
              <div className="space-y-6">
                {/* Uploading Step */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-white/90">
                      {status === "uploading" ? (
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      Uploading Audio
                    </span>
                    <span className="text-zinc-400 font-mono">{uploadProgress}%</span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                {/* Transcription Step */}
                <div className={cn(
                  "flex items-center justify-between text-sm transition-opacity duration-300",
                  status === "uploading" ? "opacity-30" : "opacity-100"
                )}>
                  <span className="flex items-center gap-2 font-medium text-white/90">
                    {status === "transcribing" ? (
                      <AudioLines className="w-4 h-4 text-cyan-400 animate-pulse-slow" />
                    ) : status === "summarizing" || status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    )}
                    Transcribing Audio (Whisper STT)
                  </span>
                  {status === "transcribing" && (
                    <span className="text-cyan-400 text-xs font-medium animate-pulse">
                      Converting speech to text...
                    </span>
                  )}
                </div>

                {/* Summarization Step */}
                <div className={cn(
                  "flex items-center justify-between text-sm transition-opacity duration-300",
                  status === "uploading" || status === "transcribing" ? "opacity-30" : "opacity-100"
                )}>
                  <span className="flex items-center gap-2 font-medium text-white/90">
                    {status === "summarizing" ? (
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    ) : status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    )}
                    Extracting Insights (OpenAI LLM)
                  </span>
                  {status === "summarizing" && (
                    <span className="text-indigo-400 text-xs font-medium animate-pulse">
                      Generating summary & action items...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
