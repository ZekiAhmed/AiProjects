import { google } from "@ai-sdk/google";
import { embedMany } from "ai";

// const { embedding, usage } = await embed({
//   model: google.embedding("models/gemini-embedding-001"),
//   value: "hi",
// });

// const embeddingModel = google.embedding("gemini-embedding-001");  // deprecated

const EMBEDDING_MODEL = google.textEmbeddingModel("text-embedding-004");

function generateChuncks(input: string) {
  return input
    .split("\n\n")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export async function generateEmbeddings(
  value: string
): Promise<Array<{ content: string; embedding: number[] }>> {
  const chunks = generateChuncks(value);
  const { embeddings, usage } = await embedMany({
    model: EMBEDDING_MODEL,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    content: chunks[index],
    embedding,
  }));
}
