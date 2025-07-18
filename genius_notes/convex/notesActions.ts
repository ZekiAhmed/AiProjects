"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { generateEmbeddings } from "../src/lib/embeddings";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const createNote = action({
  args: {
    title: v.string(),
    body: v.string(),
  },
  returns: v.id("notes"),
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.current);
    if (!user) {
      throw new Error("User must be authenticated to create a note");
    }

    const text = `${args.title}\n\n${args.body}`;
    const embeddings = await generateEmbeddings(text);

    const noteId: Id<"notes"> = await ctx.runMutation(
      internal.notes.createNoteWithEmbeddings,
      {
        title: args.title,
        body: args.body,
        userId: user._id,
        embeddings,
      }
    );

    return noteId;

    // return await ctx.db.insert("notes", {
    //   title: args.title,
    //   body: args.body,
    //   userId: user._id, // Use user._id or the appropriate user identifier
    // });
  },
});
