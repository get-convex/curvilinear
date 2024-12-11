import { s, streamQuery } from "./schema";

const table = s.table("issues", async (ctx, id) => {
  console.log("looking up", id);
  const issueId = ctx.db.normalizeId("issues", id);
  if (!issueId) {
    return null;
  }
  const issue = await ctx.db.get(issueId);
  if (!issue) {
    return null;
  }
  console.log("issue", issue);
  return issue;
});

export const get = table.get;

export const by_issue_id = table.index(
  "by_issue_id",
  async function* (ctx, { key, inclusive, direction }) {
    console.log("by_issue_id", key, inclusive, direction);
    const stream = streamQuery(ctx, {
      table: "issues",
      index: "by_issue_id",
      startIndexKey: [...key],
      startInclusive: inclusive,
      order: direction,
    });
    for await (const [issue, _indexKey] of stream) {
      console.log("=> _id", issue);
      yield issue._id;
    }
  },
);
