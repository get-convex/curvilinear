import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { tableResolverFactory } from "local-store/server/resolvers";
import { streamQueryForServerSchema } from "local-store/server/streamQuery";
import schema from "../schema";

export const sync = defineSchema({
  issues: defineTable({
    title: v.string(),
    description: v.string(),
    priority: v.string(),
    status: v.string(),
    modified: v.number(),
    created: v.number(),
    username: v.string(),
  }).index("by_creation_time", ["created"]),

  comments: defineTable({
    id: v.string(),
    body: v.string(),
    username: v.string(),
    issue_id: v.string(),
    created_at: v.number(),
  }).index("by_issue_id", ["issue_id", "created_at"]),
});

// @ts-expect-error ugh SchemaDefinition has private readonly field that causes a type error
export const s = tableResolverFactory(sync, schema);
// @ts-expect-error ugh SchemaDefinition has private readonly field that causes a type error
export const streamQuery = streamQueryForServerSchema(schema);
