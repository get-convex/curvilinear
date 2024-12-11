import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { tableResolverFactory } from "local-store/server/resolvers";
import { streamQueryForServerSchema } from "local-store/server/streamQuery";
import schema from "../schema";

export const sync = defineSchema({
  issues: defineTable({
    id: v.string(),
    title: v.string(),
    description: v.string(),
    priority: v.string(),
    status: v.string(),
    modified: v.number(),
    created: v.number(),
    kanbanorder: v.string(),
    username: v.string(),
  }).index("by_issue_id", ["id"]),

  comments: defineTable({
    id: v.string(),
    body: v.string(),
    username: v.string(),
    issue_id: v.string(),
    created_at: v.number(),
  }).index("by_issue_id", ["issue_id", "created_at"]),
});

export const s = tableResolverFactory(sync, schema);
export const streamQuery = streamQueryForServerSchema(schema);
