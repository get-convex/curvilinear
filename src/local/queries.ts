import { Issue } from "../types/types";
import { factory } from "./types";

export const loadAllIssues = factory.defineLocalQuery((ctx) => {
  return ctx.localDb.query("issues").withIndex("by_issue_id").take(100000);
}, "loadAllIssues");

export const getIssueById = factory.defineLocalQuery(
  (ctx, args: { id: string }) => {
    const issues: Issue[] = loadAllIssues.handler(ctx, {});
    return issues.find((i) => i.id === args.id) ?? null;
  },
  "getIssueById"
);

export const loadComments = factory.defineLocalQuery(
  (ctx, args: { issue_id: string }) => {
    const results = ctx.localDb
      .query("comments")
      .withIndex("by_issue_id", (q: any) => q.eq("issue_id", args.issue_id))
      .collect();
    for (const result of results) {
      if (result.issue_id !== args.issue_id) {
        console.log("issue_id mismatch", result.issue_id, args.issue_id);
      }
    }
    return results.filter((r: any) => r.issue_id === args.issue_id);
  },
  "loadComments"
);
