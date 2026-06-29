export interface ActionItem {
  assignee: string;
  task: string;
  deadline: string;
}

export interface StructuredSummary {
  title: string;
  overview: string;
  key_decisions: string[];
  action_items: ActionItem[];
}

export interface Meeting {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  overview: string;
  key_decisions: string[];
  action_items: ActionItem[];
  raw_transcript: string;
}
