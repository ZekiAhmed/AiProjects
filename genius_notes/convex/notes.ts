import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

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
