import { api } from "../../convex/_generated/api";
import { FunctionArgs } from "convex/server";
import { getIssueById } from "./queries";
import { factory } from "./types";

export const createIssue = factory.defineLocalMutation(
  api.issues.createIssue,
  (ctx, args: FunctionArgs<typeof api.issues.createIssue>) => {
    ctx.localDb.insert("issues", args.id, args);
  },
);
export const changeStatus = factory.defineLocalMutation(
  api.issues.changeStatus,
  (ctx, args: FunctionArgs<typeof api.issues.changeStatus>) => {
    const issue = getIssueById.handler(ctx, { id: args.id });
    if (!issue) {
      throw new Error("Issue not found");
    }
    ctx.localDb.replace("issues", args.id, {
      ...issue,
      status: args.status,
    });
  },
);

export const changePriority = factory.defineLocalMutation(
  api.issues.changePriority,
  (ctx, args: FunctionArgs<typeof api.issues.changePriority>) => {
    const issue = getIssueById.handler(ctx, { id: args.id });
    if (!issue) {
      throw new Error("Issue not found");
    }
    ctx.localDb.replace("issues", args.id, {
      ...issue,
      priority: args.priority,
    });
  },
);
export const changeTitle = factory.defineLocalMutation(
  api.issues.changeTitle,
  (ctx, args: FunctionArgs<typeof api.issues.changeTitle>) => {
    const issue = getIssueById.handler(ctx, { id: args.id });
    if (!issue) {
      throw new Error("Issue not found");
    }
    ctx.localDb.replace("issues", args.id, {
      ...issue,
      title: args.title,
    });
  },
);
export const changeDescription = factory.defineLocalMutation(
  api.issues.changeDescription,
  (ctx, args: FunctionArgs<typeof api.issues.changeDescription>) => {
    const issue = getIssueById.handler(ctx, { id: args.id });
    if (!issue) {
      throw new Error("Issue not found");
    }
    ctx.localDb.replace("issues", args.id, {
      ...issue,
      title: args.description,
    });
  },
);
export const changeKanbanOrder = factory.defineLocalMutation(
  api.issues.changeKanbanOrder,
  (ctx, args: FunctionArgs<typeof api.issues.changeKanbanOrder>) => {
    const issue = getIssueById.handler(ctx, { id: args.id });
    if (!issue) {
      throw new Error("Issue not found");
    }
    ctx.localDb.replace("issues", args.id, {
      ...issue,
      status: args.status,
      kanbanorder: args.kanbanorder,
    });
  },
);
export const deleteIssue = factory.defineLocalMutation(
  api.issues.deleteIssue,
  (ctx, args: FunctionArgs<typeof api.issues.deleteIssue>) => {
    ctx.localDb.delete("issues", args.id);
  },
);
export const postComment = factory.defineLocalMutation(
  api.comments.postComment,
  (ctx, args: FunctionArgs<typeof api.comments.postComment>) => {
    ctx.localDb.insert("comments", args.id, args);
  },
);
