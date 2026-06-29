export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export interface Decision {
  id: string;
  text: string;
  rationale: string;
}

export interface TranscriptSegment {
  speaker: string;
  timestamp: string;
  text: string;
}

export interface MeetingSummary {
  title: string;
  date: string;
  duration: string;
  participants: string[];
  overview: string;
  decisions: Decision[];
  actionItems: ActionItem[];
  transcript: TranscriptSegment[];
}

export const mockMeetingSummary: MeetingSummary = {
  title: "AI Feature Integration & Roadmap Sync",
  date: "June 25, 2026",
  duration: "42 mins",
  participants: ["Anmol Mehta (Product)", "Sarah Chen (Eng Lead)", "David Kim (AI Researcher)"],
  overview: "The team aligned on integrating Gemini 3.5 Flash for the meeting summarizer MVP. We resolved to run local Whisper models for speech-to-text initially to reduce cost and API latency, and layout a roadmap for streaming transcription support in Q3.",
  decisions: [
    {
      id: "dec-1",
      text: "Use Gemini 3.5 Flash for the summarization service.",
      rationale: "It offers the best trade-off between cost, context length, and latency for large meeting transcriptions."
    },
    {
      id: "dec-2",
      text: "Deploy Whisper-large-v3 on self-hosted GPU nodes for transcription.",
      rationale: "Ensures compliance with our strict corporate data privacy rules and cuts long-term transcription costs by 65%."
    }
  ],
  actionItems: [
    {
      id: "act-1",
      text: "Set up the local Whisper inference endpoint (HuggingFace TGI).",
      assignee: "David Kim",
      dueDate: "July 2",
      completed: false
    },
    {
      id: "act-2",
      text: "Create Next.js API routes for the speech-to-text ingestion.",
      assignee: "Sarah Chen",
      dueDate: "July 5",
      completed: false
    },
    {
      id: "act-3",
      text: "Prepare Figma mockups for the live real-time transcription dashboard.",
      assignee: "Anmol Mehta",
      dueDate: "July 8",
      completed: true
    }
  ],
  transcript: [
    {
      speaker: "Anmol Mehta",
      timestamp: "00:12",
      text: "Thanks everyone for joining. Today we need to align on the core model choices and hosting strategy for the upcoming AI Meeting Summarizer. Let's start with Whisper vs. APIs."
    },
    {
      speaker: "Sarah Chen",
      timestamp: "01:05",
      text: "From an engineering perspective, hosting Whisper-large-v3 on our cluster using HuggingFace Text Generation Inference gives us absolute control. It also keeps transcripts completely local, which is a major sales point for enterprises."
    },
    {
      speaker: "David Kim",
      timestamp: "02:40",
      text: "I agree with Sarah. I ran some test runs on Whisper-large-v3 and the word error rate is under 3%. If we pre-process the audio to clean up background noise, it is comparable to any commercial cloud API."
    },
    {
      speaker: "Anmol Mehta",
      timestamp: "03:15",
      text: "Excellent. Let's make that a final decision. What about the LLM side? We need something quick that handles large meeting contexts without timing out or draining our budget."
    },
    {
      speaker: "Sarah Chen",
      timestamp: "04:02",
      text: "I highly recommend Gemini 3.5 Flash. It has a massive context window of up to 1 million tokens, meaning we can easily feed in a 3-hour long meeting without chunking or losing context. It's also super cost-effective."
    },
    {
      speaker: "Anmol Mehta",
      timestamp: "05:45",
      text: "That fits the product constraints perfectly. Let's lock in Gemini 3.5 Flash for the summarizer. David, can you take the lead on setting up the Whisper server?"
    },
    {
      speaker: "David Kim",
      timestamp: "06:10",
      text: "Yes, I will spin up an instance on our dev cluster this afternoon and document the API endpoint."
    }
  ]
};
