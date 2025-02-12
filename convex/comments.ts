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
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    if (identity.name !== args.username) {
      throw new Error("Username does not match logged in user.");
    }
    return ctx.db.insert("comments", args);
  },
});
