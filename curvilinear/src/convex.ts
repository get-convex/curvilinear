import { sync as syncSchema } from "../convex/sync/schema";
import { ConvexReactClient } from "convex/react";
import { MutationRegistry } from "local-store/react/mutationRegistry";
import {
  createIssue,
  changeStatus,
  changePriority,
  changeTitle,
  changeDescription,
  deleteIssue,
  postComment,
} from "./local/mutations";
import { createLocalStoreClient } from "local-store/react/LocalStoreProvider";

export const clerkPubKey =
  "pk_test_c3BlY2lhbC1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk";
export const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const mutationRegistry = new MutationRegistry(syncSchema);
mutationRegistry
  .register(createIssue)
  .register(changeStatus)
  .register(changePriority)
  .register(changeTitle)
  .register(changeDescription)
  .register(deleteIssue)
  .register(postComment);

export const localStore = createLocalStoreClient({
  syncSchema,
  mutationRegistry,
  convexClient: convex,
  convexUrl: import.meta.env.VITE_CONVEX_URL,
  persistenceKey:
    import.meta.env.VITE_DISABLE_INDEXED_DB !== undefined
      ? null
      : "curvilinear",
});
