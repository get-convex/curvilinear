import { api } from "../../convex/_generated/api";
import { FunctionArgs } from "convex/server";
import { factory } from "./types";

export const createIssue = factory.defineLocalMutation(
  api.issues.createIssue,
  (ctx, args: FunctionArgs<typeof api.issues.createIssue>) => {
    ctx.localDb.insert("issues", args.id, args);
  }
);

export const changeStatus = factory.defineLocalMutation(
  api.issues.changeStatus,
  (ctx, args: FunctionArgs<typeof api.issues.changeStatus>) => {
    ctx.localDb.patch("issues", args.id, {
      status: args.status,
    });
  }
);

export const changePriority = factory.defineLocalMutation(
  api.issues.changePriority,
  (ctx, args: FunctionArgs<typeof api.issues.changePriority>) => {
    ctx.localDb.patch("issues", args.id, {
      priority: args.priority,
    });
  }
);

export const changeTitle = factory.defineLocalMutation(
  api.issues.changeTitle,
  (ctx, args: FunctionArgs<typeof api.issues.changeTitle>) => {
    ctx.localDb.patch("issues", args.id, {
      title: args.title,
    });
  }
);

export const changeDescription = factory.defineLocalMutation(
  api.issues.changeDescription,
  (ctx, args: FunctionArgs<typeof api.issues.changeDescription>) => {
    ctx.localDb.patch("issues", args.id, {
      description: args.description,
    });
  }
);

export const deleteIssue = factory.defineLocalMutation(
  api.issues.deleteIssue,
  (ctx, args: FunctionArgs<typeof api.issues.deleteIssue>) => {
    ctx.localDb.delete("issues", args.id);
  }
);

export const postComment = factory.defineLocalMutation(
  api.comments.postComment,
  (ctx, args: FunctionArgs<typeof api.comments.postComment>) => {
    ctx.localDb.insert("comments", args.id, args);
  }
);

export const deleteComment = factory.defineLocalMutation(
  api.comments.deleteComment,
  (ctx, args: FunctionArgs<typeof api.comments.deleteComment>) => {
    ctx.localDb.delete("comments", args.id);
  }
);
