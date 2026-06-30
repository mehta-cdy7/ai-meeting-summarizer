import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return new Response("Transcript is required", { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
    if (!apiKey) {
      return new Response("API key is not configured", { status: 500 });
    }

    const openai = createOpenAI({
      apiKey,
    });

    const result = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        title: z.string().describe("A short, descriptive title for the meeting (3-5 words)."),
        overview: z.string().describe("A 2-3 sentence high-level summary of the meeting."),
        key_decisions: z.array(z.string()).describe("A list of the major decisions approved or agreed upon."),
        action_items: z.array(
          z.object({
            assignee: z.string().describe("The name of the person assigned, or 'Unassigned'"),
            task: z.string(),
            deadline: z.string().describe("The due date, or 'TBD' if not mentioned"),
          })
        ).describe("A list of actionable tasks."),
      }),
      prompt: `You are a professional AI meeting assistant. Generate a high-quality meeting summary with a title and the following sections:
- Title
- Overview
- Key Decisions
- Action Items
Be concise, specific, and clear.

Transcript:
${transcript}`,
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error("Error in summarize route:", err);
    return new Response(err.message || "Internal Server Error", { status: 500 });
  }
}
