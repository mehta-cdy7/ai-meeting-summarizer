"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  CheckSquare, 
  Gavel, 
  FileText, 
  ArrowLeft,
  Sparkles,
  Download,
  Share2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { mockMeetingSummary, ActionItem } from "../lib/mockData";
import { cn } from "../lib/utils";

interface SummaryDashboardProps {
  onBack: () => void;
}

export default function SummaryDashboard({ onBack }: SummaryDashboardProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");
  const [actionItems, setActionItems] = useState<ActionItem[]>(mockMeetingSummary.actionItems);

  const toggleActionItem = (id: string) => {
    setActionItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Upload
        </button>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all text-xs font-semibold">
            <Download className="w-3.5 h-3.5" />
            Export MD
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all text-xs font-semibold">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Main Title Card */}
      <Card className="relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl -z-10" />
        
        <CardContent className="p-6">
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-4">
            <Sparkles className="w-3 h-3" />
            AI Processed Successful
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            {mockMeetingSummary.title}
          </h1>

          {/* Meeting Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-zinc-400 text-sm border-t border-white/5 pt-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>{mockMeetingSummary.date}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{mockMeetingSummary.duration}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{mockMeetingSummary.participants.length} Participants</span>
            </div>
          </div>

          {/* Participants Badges */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
            {mockMeetingSummary.participants.map((person, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs font-medium text-zinc-300"
              >
                {person}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveTab("summary")}
          className={cn(
            "pb-3 text-sm font-semibold relative transition-colors",
            activeTab === "summary" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <span className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Summary & Insights
          </span>
          {activeTab === "summary" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={cn(
            "pb-3 text-sm font-semibold relative transition-colors",
            activeTab === "transcript" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Transcript Timeline
          </span>
          {activeTab === "transcript" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "summary" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Columns - Overview & Decisions */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <CardTitle>Overview Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {mockMeetingSummary.overview}
                </p>
              </CardContent>
            </Card>

            {/* Decisions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-amber-400" />
                  <CardTitle>Key Decisions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMeetingSummary.decisions.map((decision) => (
                  <div 
                    key={decision.id} 
                    className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1.5"
                  >
                    <h5 className="text-sm font-semibold text-amber-300">
                      {decision.text}
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-300">Rationale:</strong> {decision.rationale}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action Items */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-cyan-400" />
                  <CardTitle>Action Items</CardTitle>
                </div>
                <CardDescription>Click to complete checklist items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {actionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleActionItem(item.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none",
                      item.completed 
                        ? "bg-zinc-950/20 border-white/5 opacity-55 hover:opacity-75" 
                        : "bg-white/[0.03] border-white/8 hover:bg-white/[0.05] hover:border-white/12"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-violet-500 focus:ring-violet-500 h-4.5 w-4.5 shrink-0 accent-violet-500"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className={cn(
                        "text-xs sm:text-sm font-medium text-white/90 leading-tight",
                        item.completed && "line-through text-zinc-500"
                      )}>
                        {item.text}
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="text-[10px] bg-white/5 border border-white/8 text-zinc-400 px-1.5 py-0.5 rounded">
                          {item.assignee}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Due {item.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Full Transcript View */
        <Card className="border border-white/10">
          <CardContent className="p-4 sm:p-6 space-y-6 max-h-[500px] overflow-y-auto">
            {mockMeetingSummary.transcript.map((seg, idx) => (
              <div key={idx} className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-violet-300">
                  {getInitials(seg.speaker)}
                </div>
                <div className="flex-1 space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">
                      {seg.speaker}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                      {seg.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-light">
                    {seg.text}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
