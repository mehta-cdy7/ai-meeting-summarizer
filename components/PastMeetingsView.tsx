import React from "react";
import { FileText, Sparkles } from "lucide-react";
import { Meeting } from "../types";

interface PastMeetingsViewProps {
  historyMeetings: Meeting[];
  loadingHistory: boolean;
  onSelectMeeting: (meeting: Meeting) => void;
  onNavigateToNew: () => void;
}

export default function PastMeetingsView({
  historyMeetings,
  loadingHistory,
  onSelectMeeting,
  onNavigateToNew,
}: PastMeetingsViewProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-400" />
          Past Meetings
        </h2>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Access transcripts and AI summaries of your previously processed meetings.
        </p>
      </div>

      {loadingHistory ? (
        // Skeleton loading state
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 bg-white/5 border border-white/8 rounded-2xl p-5 flex flex-col justify-between animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-6 bg-white/10 rounded w-3/4"></div>
              </div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : historyMeetings.length === 0 ? (
        // Empty state
        <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
          <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <p className="text-sm font-semibold text-zinc-400">No meeting history found</p>
          <p className="text-xs text-zinc-500 font-light mt-1 max-w-sm mx-auto">
            Meetings you transcribe and summarize will automatically save here. Head back to "New Summary" to run your first meeting!
          </p>
          <button
            onClick={onNavigateToNew}
            className="mt-6 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer"
          >
            Summarize New Meeting
          </button>
        </div>
      ) : (
        // Meeting list
        <div className="grid grid-cols-1 gap-4">
          {historyMeetings.map((meeting) => (
            <button
              key={meeting.id}
              onClick={() => onSelectMeeting(meeting)}
              className="glass-panel glass-panel-hover rounded-2xl p-5 text-left transition-all duration-300 border border-white/10 hover:border-violet-500/30 flex flex-col justify-between cursor-pointer w-full group"
            >
              <div className="w-full">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                  <span>
                    {new Date(meeting.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="bg-white/5 border border-white/8 px-2 py-0.5 rounded text-[9px] text-zinc-400">
                    {meeting.action_items?.length || 0} action items
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mt-2 mb-1.5 group-hover:text-violet-400 transition-colors line-clamp-1">
                  {meeting.title}
                </h3>
                <p className="text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed mb-1">
                  {meeting.overview}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
