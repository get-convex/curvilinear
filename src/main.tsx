import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LocalStoreProvider } from "local-store/react/LocalStoreProvider";
import { sync as syncSchema } from "../convex/sync/schema";
import { MutationRegistry } from "local-store/react/MutationRegistry";
import {
  changeDescription,
  changeKanbanOrder,
  changePriority,
  changeStatus,
  changeTitle,
  createIssue,
  deleteIssue,
  postComment,
} from "./local/mutations";
import { IndexedDbPersistence } from "local-store/browser/localPersistence";

const clerkPubKey =
  "pk_test_c3BlY2lhbC1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
// Create modal root element
const modalRoot = document.createElement("div");
modalRoot.id = "root-modal";
document.body.appendChild(modalRoot);

const mutationRegistry = new MutationRegistry(syncSchema);
mutationRegistry
  .register(createIssue)
  .register(changeStatus)
  .register(changePriority)
  .register(changeTitle)
  .register(changeDescription)
  .register(changeKanbanOrder)
  .register(deleteIssue)
  .register(postComment);

const persistence = new IndexedDbPersistence("curvilinear");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LocalStoreProvider
          syncSchema={syncSchema}
          client={(convex as any).sync}
          mutations={mutationRegistry}
          persistence={persistence}
        >
          <App />
        </LocalStoreProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
    {/* </ErrorBoundary> */}
  </React.StrictMode>
);
