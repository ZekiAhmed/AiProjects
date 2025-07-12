import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

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

export const createNote = mutation({
  args: {
    title: v.string(),
    body: v.string(),
  },
  returns: v.id("notes"),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx); // Use the helper function instead of the Convex query
    if (!user) {
      throw new Error("User must be authenticated to create a note");
    }
    return await ctx.db.insert("notes", {
      title: args.title,
      body: args.body,
      userId: user._id, // Use user._id or the appropriate user identifier
    });
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
    await ctx.db.delete(args.noteId);
  },
});
