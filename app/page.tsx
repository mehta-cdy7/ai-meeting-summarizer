"use client";

import React, { useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

// Components
import Auth from "../components/Auth";
import Header from "../components/Header";
import NewSummaryView from "../components/NewSummaryView";
import PastMeetingsView from "../components/PastMeetingsView";
import MeetingDetailView from "../components/MeetingDetailView";

// Hooks
import { useSummarizer } from "../hooks/useSummarizer";
import { useMeetingHistory } from "../hooks/useMeetingHistory";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [viewTab, setViewTab] = useState<"new" | "history">("new");

  // Authenticate user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const {
    historyMeetings,
    loadingHistory,
    selectedHistoryMeeting,
    setSelectedHistoryMeeting,
    saveMeeting,
  } = useMeetingHistory(user);

  const {
    status,
    uploadProgress,
    summary,
    transcript,
    error,
    handleUploadStart,
    handleReset,
  } = useSummarizer({
    onSummaryGenerated: async (newSummary, rawTranscript) => {
      await saveMeeting(newSummary, rawTranscript);
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleReset();
    setViewTab("new");
    setSelectedHistoryMeeting(null);
  };

  return (
    <main className="flex-1 w-full relative min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6">
      
      {/* Background Radial Glow Layer */}
      <div className="radial-bg" />

      {/* Header Branding */}
      <Header user={user} onSignOut={handleSignOut} />

      {/* Main Tab Toggle Bar */}
      {user && (
        <div className="w-full max-w-3xl flex border-b border-white/5 mb-8 gap-8">
          <button
            onClick={() => {
              setViewTab("new");
              setSelectedHistoryMeeting(null);
            }}
            className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer ${
              viewTab === "new" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            New Summary
            {viewTab === "new" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => {
              setViewTab("history");
              setSelectedHistoryMeeting(null);
            }}
            className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer ${
              viewTab === "history" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Past Meetings
            {viewTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
            )}
          </button>
        </div>
      )}

      {/* Primary Content Guarded by Auth */}
      {loadingAuth ? (
        <div className="w-full max-w-3xl text-center space-y-12 my-auto flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(139,92,246,0.4)]">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-zinc-500 text-xs tracking-wider uppercase font-medium animate-pulse">
            Checking credentials...
          </p>
        </div>
      ) : !user ? (
        <Auth />
      ) : viewTab === "new" ? (
        // --- NEW SUMMARY TAB ---
        status !== "completed" ? (
          <NewSummaryView
            status={status}
            uploadProgress={uploadProgress}
            error={error}
            onUploadStart={handleUploadStart}
            onReset={handleReset}
          />
        ) : (
          summary && (
            <MeetingDetailView
              title={summary.title}
              overview={summary.overview}
              keyDecisions={summary.key_decisions}
              actionItems={summary.action_items}
              rawTranscript={transcript}
              subtitle="Processed with Whisper-large & GPT-4o-mini"
              actionButton={
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all text-xs font-semibold cursor-pointer"
                >
                  Upload Another
                </button>
              }
            />
          )
        )
      ) : (
        // --- PAST MEETINGS TAB ---
        selectedHistoryMeeting ? (
          <MeetingDetailView
            title={selectedHistoryMeeting.title}
            overview={selectedHistoryMeeting.overview}
            keyDecisions={selectedHistoryMeeting.key_decisions}
            actionItems={selectedHistoryMeeting.action_items}
            rawTranscript={selectedHistoryMeeting.raw_transcript}
            subtitle={`Processed on ${new Date(selectedHistoryMeeting.created_at).toLocaleString(
              undefined,
              { dateStyle: "medium", timeStyle: "short" }
            )}`}
            actionButton={
              <button
                onClick={() => setSelectedHistoryMeeting(null)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-4 bg-white/5 border border-white/8 px-3 py-1 rounded-lg cursor-pointer font-medium"
              >
                ← Back to Past Meetings
              </button>
            }
          />
        ) : (
          <PastMeetingsView
            historyMeetings={historyMeetings}
            loadingHistory={loadingHistory}
            onSelectMeeting={setSelectedHistoryMeeting}
            onNavigateToNew={() => setViewTab("new")}
          />
        )
      )}

      {/* Footer copyright */}
      <footer className="mt-auto pt-16 text-zinc-600 text-xs text-center flex items-center gap-1">
        <span>© {new Date().getFullYear()} Recall AI. Built with</span>
        <Sparkles className="w-3 h-3 text-violet-500" />
        <span>and Next.js v16.</span>
      </footer>
    </main>
  );
}
