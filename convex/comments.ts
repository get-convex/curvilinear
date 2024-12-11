import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const postComment = mutation({
  args: {
    id: v.string(),
    username: v.string(),
    body: v.string(),
    issue_id: v.string(),
    created_at: v.number(),
  },
  handler: async ({ db }, args) => {
    return db.insert("comments", args);
  },
});
