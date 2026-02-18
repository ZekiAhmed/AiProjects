// src/lib/embeddings.ts
import { embed, embedMany } from "ai";
// import { openai } from "@ai-sdk/openai";
import { registry } from "@/lib/models";

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.replaceAll("\n", " ");

  const { embedding } = await embed({
    // model: openai.textEmbeddingModel("text-embedding-3-small"),
    model: registry.embeddingModel("ollama:fast"),
    value: input,
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const inputs = texts.map((text) => text.replaceAll("\n", " "));

  const { embeddings } = await embedMany({
    // model: openai.textEmbeddingModel("text-embedding-3-small"),
    model: registry.embeddingModel("ollama:fast"),
    values: inputs,
  });

  return embeddings;
}
