import { v } from "convex/values";
import { DatabaseReader, mutation } from "./_generated/server";

export const createIssue = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    priority: v.string(),
    status: v.string(),
    modified: v.number(),
    created: v.number(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    if (identity.name !== args.username) {
      throw new Error("Username does not match logged in user.");
    }
    await ctx.db.insert("issues", args);
  },
});

export const changeStatus = mutation({
  args: {
    id: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    const issue = await getIssue(ctx.db, args.id);
    return ctx.db.patch(issue._id, {
      status: args.status,
      modified: Date.now(),
    });
  },
});

export const changePriority = mutation({
  args: {
    id: v.string(),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    const issue = await getIssue(ctx.db, args.id);
    return ctx.db.patch(issue._id, {
      priority: args.priority,
      modified: Date.now(),
    });
  },
});

export const changeTitle = mutation({
  args: {
    id: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    const issue = await getIssue(ctx.db, args.id);
    return ctx.db.patch(issue._id, { title: args.title, modified: Date.now() });
  },
});

export const changeDescription = mutation({
  args: {
    id: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    const issue = await getIssue(ctx.db, args.id);
    return ctx.db.patch(issue._id, {
      description: args.description,
      modified: Date.now(),
    });
  },
});

export const deleteIssue = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in.");
    }
    const issue = await getIssue(ctx.db, args.id);
    await ctx.db.delete(issue._id);
  },
});

async function maybeGetIssue(db: DatabaseReader, id: string) {
  return db
    .query("issues")
    .withIndex("by_issue_id", (q) => q.eq("id", id))
    .unique();
}

async function getIssue(db: DatabaseReader, id: string) {
  const issue = await maybeGetIssue(db, id);
  if (!issue) {
    throw new Error("Issue not found");
  }
  return issue;
}
