import { factory } from "./types";

export const preload = factory.defineLocalQuery((ctx) => {
  return [];
  const issues = ctx.localDb.query("issues").withIndex("by_issue_id").collect();
  const allComments = [];
  for (const issue of issues) {
    const comments = ctx.localDb
      .query("comments")
      .withIndex("by_issue_id", (q: any) => q.eq("issue_id", issue.id))
      .collect();
    allComments.push(...comments);
  }
  let length = 0;
  for (const issue of issues) {
    length += JSON.stringify(issue).length;
  }
  for (const comment of allComments) {
    length += JSON.stringify(comment).length;
  }
  console.log(
    `Preloaded ${issues.length} issues and ${allComments.length} comments (${(length / 1024).toFixed(2)}KB).`
  );
  return [];
}, "preload");

export const loadAllIssues = factory.defineLocalQuery((ctx) => {
  return ctx.localDb.query("issues").withIndex("by_creation_time").collect();
}, "loadAllIssues");

export const getIssueById = factory.defineLocalQuery(
  (ctx, args: { id: string }) => {
    return ctx.localDb.get("issues", args.id as any);
  },
  "getIssueById"
);

export const loadComments = factory.defineLocalQuery(
  (ctx, args: { issue_id: string }) => {
    return ctx.localDb
      .query("comments")
      .withIndex("by_issue_id", (q: any) => q.eq("issue_id", args.issue_id))
      .collect();
  },
  "loadComments"
);
