import React, { useState } from "react";
import { Sparkles, FileText, Gavel, CheckSquare } from "lucide-react";
import { ActionItem } from "../types";

interface MeetingDetailViewProps {
  title?: string;
  overview?: string;
  keyDecisions?: string[];
  actionItems?: any[];
  rawTranscript: string;
  subtitle: string;
  actionButton?: React.ReactNode;
}

export default function MeetingDetailView({
  title = "Meeting Insights",
  overview = "",
  keyDecisions = [],
  actionItems = [],
  rawTranscript,
  subtitle,
  actionButton,
}: MeetingDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div>
          {actionButton && <div className="mb-2">{actionButton}</div>}
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
            {title || "Meeting Insights"}
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-medium tracking-wider">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveTab("summary")}
          className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer ${
            activeTab === "summary" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          AI Summary
          {activeTab === "summary" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer ${
            activeTab === "transcript" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Raw Transcript
          {activeTab === "transcript" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-zinc-300 text-base leading-relaxed max-h-[600px] overflow-y-auto">
        {activeTab === "summary" ? (
          <div className="space-y-6 text-left">
            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                Overview
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed font-light bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                {overview || "Writing overview..."}
              </p>
            </div>

            {/* Key Decisions */}
            {keyDecisions && keyDecisions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-400" />
                  Key Decisions
                </h3>
                <div className="grid gap-2.5">
                  {keyDecisions.map((decision, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-sm text-zinc-300 font-light leading-relaxed"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{decision || "Writing decision..."}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {actionItems && actionItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  Action Items
                </h3>
                <div className="grid gap-3">
                  {actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/90 leading-snug">
                          {item?.task || "Writing task..."}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <span className="text-[10px] bg-white/5 border border-white/8 text-zinc-300 px-2 py-0.5 rounded-md font-medium">
                            Assignee: {item?.assignee || "Thinking..."}
                          </span>
                          <span className="text-[10px] bg-white/5 border border-white/8 text-zinc-400 px-2 py-0.5 rounded-md">
                            Due: {item?.deadline || "Thinking..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-light text-sm text-zinc-300 leading-relaxed text-left">
            {rawTranscript}
          </div>
        )}
      </div>
    </div>
  );
}
