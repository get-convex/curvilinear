import { s, streamQuery } from "./schema";

const table = s.table("comments", async (ctx, id) => {
  const commentId = ctx.db.normalizeId("comments", id);
  if (!commentId) {
    return null;
  }
  const comment = await ctx.db.get(commentId);
  if (!comment) {
    return null;
  }
  return comment;
});

export const get = table.get;

export const by_issue_id = table.index(
  "by_issue_id",
  async function* (ctx, { key, inclusive, direction }) {
    const stream = streamQuery(ctx, {
      table: "comments",
      index: "by_issue_id",
      startIndexKey: [...key],
      startInclusive: inclusive,
      order: direction,
    });
    for await (const [comment, _indexKey] of stream) {
      yield comment._id;
    }
  },
);
