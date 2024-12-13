import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  issues: defineTable({
    id: v.string(),
    title: v.string(),
    description: v.string(),
    priority: v.string(),
    status: v.string(),
    modified: v.number(),
    created: v.number(),
    username: v.string(),
  }).index("by_issue_id", ["id"]),

  comments: defineTable({
    id: v.string(),
    body: v.string(),
    username: v.string(),
    issue_id: v.string(),
    created_at: v.number(),
  })
    .index("by_issue_id", ["issue_id", "created_at"])
    .index("by_comment_id", ["id"]),
});
