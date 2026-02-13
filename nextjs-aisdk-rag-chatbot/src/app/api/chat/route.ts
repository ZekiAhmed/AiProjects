import {
  streamText,
  UIMessage,
  convertToModelMessages
} from "ai";
import { registry } from "@/lib/models";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model:  registry.languageModel("ollama:fast"),
      messages: await convertToModelMessages(messages)
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
