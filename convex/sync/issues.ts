import { s, streamQuery } from "./schema";

const table = s.table("issues", async (ctx, id) => {
  const issue = await ctx.db
    .query("issues")
    .withIndex("by_issue_id", (q) => q.eq("id", id))
    .unique();
  if (!issue) {
    return null;
  }
  return {
    ...issue,
    _id: id as any,
  };
});

export const get = table.get;

export const by_issue_id = table.index(
  "by_issue_id",
  async function* (ctx, { key, inclusive, direction }) {
    const stream = streamQuery(ctx, {
      table: "issues",
      index: "by_issue_id",
      startIndexKey: [...key],
      startInclusive: inclusive,
      order: direction,
    });
    for await (const [issue, _indexKey] of stream) {
      yield issue.id;
    }
  }
);
