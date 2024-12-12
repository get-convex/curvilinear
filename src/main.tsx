import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LocalStoreProvider } from "local-store/react/LocalStoreProvider";
import { sync as syncSchema } from "../convex/sync/schema";
import { IndexedDbPersistence } from "local-store/browser/localPersistence";
import { LocalDbWriterImpl } from "local-store/browser/localDbWriter";
import { FunctionReference, getFunctionName } from "convex/server";
import { api } from "../convex/_generated/api";
import { getIssueById, loadAllIssues } from "./queries";
import { Issue } from "./types/types";

const clerkPubKey =
  "pk_test_c3BlY2lhbC1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
// Create modal root element
const modalRoot = document.createElement("div");
modalRoot.id = "root-modal";
document.body.appendChild(modalRoot);

type Mutation = {
  fn: FunctionReference<"mutation">;
  optimisticUpdate?: (ctx: { localDb: LocalDbWriterImpl }, args: any) => void;
};

const mutations: Record<string, Mutation> = {
  [getFunctionName(api.issues.createIssue)]: {
    fn: api.issues.createIssue,
    optimisticUpdate: (ctx, args) => {
      ctx.localDb.insert("issues", args.id, args);
    },
  },
  [getFunctionName(api.issues.changeStatus)]: {
    fn: api.issues.changeStatus,
    optimisticUpdate: (ctx, args) => {
      const issue = getIssueById(ctx, args.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      ctx.localDb.replace("issues", args.id, {
        ...issue,
        status: args.status,
      });
    },
  },
  [getFunctionName(api.issues.changePriority)]: {
    fn: api.issues.changePriority,
    optimisticUpdate: (ctx, args) => {
      const issue = getIssueById(ctx, args.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      ctx.localDb.replace("issues", args.id, {
        ...issue,
        priority: args.priority,
      });
    },
  },
  [getFunctionName(api.issues.changeTitle)]: {
    fn: api.issues.changeTitle,
    optimisticUpdate: (ctx, args) => {
      const issue = getIssueById(ctx, args.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      ctx.localDb.replace("issues", args.id, {
        ...issue,
        title: args.title,
      });
    },
  },
  [getFunctionName(api.issues.changeDescription)]: {
    fn: api.issues.changeDescription,
    optimisticUpdate: (ctx, args) => {
      const issue = getIssueById(ctx, args.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      ctx.localDb.replace("issues", args.id, {
        ...issue,
        description: args.description,
      });
    },
  },
  [getFunctionName(api.issues.changeKanbanOrder)]: {
    fn: api.issues.changeKanbanOrder,
    optimisticUpdate: (ctx, args) => {
      const issue = getIssueById(ctx, args.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      ctx.localDb.replace("issues", args.id, {
        ...issue,
        status: args.status,
        kanbanorder: args.kanbanorder,
      });
    },
  },
  [getFunctionName(api.issues.deleteIssue)]: {
    fn: api.issues.deleteIssue,
    optimisticUpdate: (ctx, args) => {
      ctx.localDb.delete("issues", args.id);
    },
  },
  [getFunctionName(api.comments.postComment)]: {
    fn: api.comments.postComment,
    optimisticUpdate: (ctx, args) => {
      ctx.localDb.insert("comments", args.id, args);
    },
  },
};

const persistence = new IndexedDbPersistence("curvilinear");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LocalStoreProvider
          syncSchema={syncSchema}
          client={(convex as any).sync}
          mutations={mutations}
          persistence={persistence}
        >
          <App />
        </LocalStoreProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
    {/* </ErrorBoundary> */}
  </React.StrictMode>,
);
