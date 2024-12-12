export function loadAllIssues(ctx: { localDb: any }, args: any) {
  return ctx.localDb.query("issues").withIndex("by_issue_id").take(100000);
}

export function getIssueById(ctx: { localDb: any }, id: string) {
  const issues: any[] = loadAllIssues(ctx, {});
  return issues.find((i: any) => i.id === id);
}

export function loadComments(
  ctx: { localDb: any },
  args: { issue_id: string },
) {
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
}
