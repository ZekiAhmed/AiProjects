import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { dish } = await req.json();

    console.log({ dish });

    const result = streamObject({
      model: google("gemini-2.5-flash"),
      schema: recipeSchema,
      prompt: `Generate a recipe for ${dish}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating recipe:", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
