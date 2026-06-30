import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { Meeting, StructuredSummary } from "../types";

export function useMeetingHistory(user: User | null) {
  const [historyMeetings, setHistoryMeetings] = useState<Meeting[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryMeeting, setSelectedHistoryMeeting] = useState<Meeting | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setHistoryMeetings((data as Meeting[]) || []);
    } catch (err: any) {
      console.error("Error fetching history:");
      console.error("Message:", err.message);
      console.error("Details:", err.details);
      console.error("Hint:", err.hint);
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveMeeting = async (summary: StructuredSummary, transcript: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("meetings").insert({
        user_id: user.id,
        title: summary.title || "Untitled Meeting Summary",
        overview: summary.overview,
        key_decisions: summary.key_decisions,
        action_items: summary.action_items,
        raw_transcript: transcript,
      });

      if (error) {
        console.error("Failed to save meeting to Supabase:");
        console.error("Message:", error.message);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
        console.error("Code:", error.code);
      } else {
        console.log("Meeting successfully saved to database!");
        await fetchHistory(); // auto refresh history
      }
    } catch (err) {
      console.error("Error saving meeting:", err);
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        console.error("Failed to delete meeting from Supabase:");
        console.error("Message:", error.message);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
        console.error("Code:", error.code);
      } else if (!data || data.length === 0) {
        console.warn(
          "No records were deleted from Supabase. This is likely because Row Level Security (RLS) is enabled on the 'meetings' table, but there is no DELETE policy allowing this action, or the record does not exist."
        );
      } else {
        console.log("Meeting successfully deleted from database!");
        setHistoryMeetings((prev) => prev.filter((m) => m.id !== id));
        if (selectedHistoryMeeting?.id === id) {
          setSelectedHistoryMeeting(null);
        }
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistoryMeetings([]);
      setSelectedHistoryMeeting(null);
    }
  }, [user]);

  return {
    historyMeetings,
    loadingHistory,
    selectedHistoryMeeting,
    setSelectedHistoryMeeting,
    fetchHistory,
    saveMeeting,
    deleteMeeting,
  };
}
