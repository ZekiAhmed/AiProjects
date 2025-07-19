import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getCurrentUser } from "./users";
import { embed } from "ai";

export const getUserNotes = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated to fetch notes");
    }
    return await ctx.db
      .query("notes")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const createNoteWithEmbeddings = internalMutation({
  args: {
    title: v.string(),
    body: v.string(),
    userId: v.id("users"),
    embeddings: v.array(
      v.object({
        embedding: v.array(v.float64()),
        content: v.string(),
      })
    ),
  },
  returns: v.id("notes"),
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      body: args.body,
      userId: args.userId,
    });

    for (const embeddingData of args.embeddings) {
      await ctx.db.insert("noteEmbeddings", {
        content: embeddingData.content,
        embedding: embeddingData.embedding,
        noteId,
        userId: args.userId,
      });
    }

    return noteId;
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated to delete a note");
    }
    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== user._id) {
      throw new Error("Note not found or does not belong to the user");
    }

    const embeddings = await ctx.db
      .query("noteEmbeddings")
      .withIndex("byNoteId", (q) => q.eq("noteId", args.noteId))
      .collect();

    for (const embedding of embeddings) {
      await ctx.db.delete(embedding._id);
    }

    await ctx.db.delete(args.noteId);
  },
});

export const fetchNotesByEmbeddingIds = internalQuery({
  args: {
    embeddingIds: v.array(v.id("noteEmbeddings")),
  },
  handler: async (ctx, args) => {
    const embeddings = [];
    for (const id of args.embeddingIds) {
      const embedding = await ctx.db.get(id);
      if (embedding !== null) {
        embeddings.push(embedding);
      }
    }

    const uniqueNoteId = [
      ...new Set(embeddings.map((embedding) => embedding.noteId)),
    ];

    const results = [];
    for (const id of uniqueNoteId) {
      const note = await ctx.db.get(id);
      if (note !== null) {
        results.push(note);
      }
    }

    return results;
  },
});
