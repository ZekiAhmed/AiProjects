import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("byClerkUserId", ["clerkUserId"]),

  notes: defineTable({
    title: v.string(),
    body: v.string(),
    userId: v.id("users"),
  }).index("byUserId", ["userId"]),

  noteEmbeddings: defineTable({
    content: v.string(),
    embedding: v.array(v.float64()),
    noteId: v.id("notes"),
    userId: v.id("users"),
  })
    .index("byNoteId", ["noteId"])
    .vectorIndex("byEmbedding", {
      vectorField: "embedding",
      dimensions: 1536, // Adjust based on your embedding model
      filterFields: ["userId"],
    }),
});
