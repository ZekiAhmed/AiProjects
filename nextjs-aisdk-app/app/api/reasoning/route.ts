import { streamText, UIMessage, convertToModelMessages } from "ai";
// import { openai } from "@ai-sdk/openai";
import { ollama } from "@/lib/ollama/client";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();


    // ✅ Check if a system message already exists
    const hasSystem = messages.some(m => m.role === "system");

    if (!hasSystem) {
      messages.unshift({
        id: crypto.randomUUID(),
        role: "system",
        parts: [
          {
            type: "text",
            text: `
You are a careful assistant. When answering, always do the following:
1. First, explain your reasoning step-by-step.
2. Then, provide the final answer clearly labeled as "Answer:".
3. Do not mix reasoning with the answer; keep them separate.
`
          }
        ]
      });
    }

    const result = streamText({
      // model: openai("gpt-5-nano"),
      model: ollama("qwen2.5:7b"),
      messages: await convertToModelMessages(messages),
      // providerOptions: {
      //   openai: {
      //     reasoningEffort: "low",
      //     reasoningSummary: "auto",
      //   },
      // },
    });

    return result.toUIMessageStreamResponse();
    // return result.toUIMessageStreamResponse({
    //   sendReasoning: true,
    // })
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
