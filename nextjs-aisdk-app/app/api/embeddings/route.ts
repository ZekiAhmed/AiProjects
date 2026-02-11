import { embed, embedMany } from "ai";
import { registry } from "@/lib/models";

export async function POST(req: Request) {
  try {

    // const { embedding } = await embed({
    //   model: registry.embeddingModel("ollama:fast"),
    //   value: "a movie about hacker what is this is correct",
    // })
    // return Response.json({ embedding })

    const body = await req.json();

    // Check if we're dealing with multiple texts
    if (Array.isArray(body.texts)) {
      const { values, embeddings, usage } = await embedMany({
        model: registry.embeddingModel("ollama:fast"),
        values: body.texts,
        maxParallelCalls: 5,
      });

      return Response.json({
        values,
        embeddings,
        usage,
        count: embeddings.length,
        dimensions: embeddings[0]?.length,
      });
    }

    // Single text embedding (our existing code)
    const { text } = body;
    const { value, embedding, usage } = await embed({
      model: registry.embeddingModel("ollama:fast"),
      value: text,
    });

    return Response.json({
      value,
      embedding,
      usage,
      dimensions: embedding.length,
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return Response.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}
