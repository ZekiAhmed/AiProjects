import { streamText, UIMessage, convertToModelMessages } from "ai";
// import { google } from "@ai-sdk/google";
import { ollama } from "@/lib/ollama/client";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      // model: google("gemini-2.5-flash"),
      model: ollama("gemma3:4b"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
