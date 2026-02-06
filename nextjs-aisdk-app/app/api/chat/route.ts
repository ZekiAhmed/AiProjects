// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from "ai";
// import { google } from "@ai-sdk/google";
import { ollama } from "@/lib/ollama/client";


export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      // model: google("gemini-2.5-flash"),
      model: ollama("gemma3:4b"),
      messages: [
        // {
        //   role: "system",
        //   content:
        //     "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.",
        // },
        {
          role: "system",
          content:
            "convert user question about React into code example.",
        },
        {
          role: "user",
          content:
            "How to toggle a boolean?",
        },
        {
          role: "assistant",
          content:
            "const [isOpen, setIsOpen] = useState(false); \nconst toggle = () => setIsOpen(!isOpen);",
        },
        ...await convertToModelMessages(messages),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
